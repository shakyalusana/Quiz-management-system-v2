import express from "express";
import QuizResult from "../models/quiz.js";
import Question from "../models/question.js";
import Category from "../models/category.js";
import auth from "../middleware/authMiddleware.js";
import { fisherYatesShuffle } from "../utils/randomizer.js";
import { calculateEloRating } from "../utils/eloRating.js";
import User from "../models/user.js";

const quizRoutes = express.Router();

// Get questions for quiz
quizRoutes.post("/questions", auth, async (req, res) => {
  try {
    const { categoryId, difficulty = "medium", count = 10 } = req.body;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Get questions matching the category and difficulty
    const questions = await Question.find({
      category: categoryId,
      difficulty: difficulty,
    }).lean();

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        message: `No questions available for this category with ${difficulty} difficulty`,
      });
    }

    // Shuffle the questions and limit to requested count
    const shuffledQuestions = fisherYatesShuffle(questions).slice(
      0,
      Math.min(count, questions.length),
    );

    // Map questions to include only necessary fields and convert correctOption to actual value
    const formattedQuestions = shuffledQuestions.map((question) => ({
      _id: question._id,
      text: question.text,
      options: question.options,
      difficulty: question.difficulty,
      category: question.category,
    }));

    res.json(formattedQuestions);
  } catch (err) {
    console.error("Error fetching quiz questions:", err);
    res.status(500).json({ message: "Error fetching quiz questions" });
  }
});

// Submit quiz results
quizRoutes.post("/submit", auth, async (req, res) => {
  try {
    const { categoryId, answers, score, stats, difficulty } = req.body;
    if (!categoryId || !answers || score === undefined) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    const quizResult = new QuizResult({
      player: req.user.id, // FIXED (see middleware fix below)
      category: categoryId,
      score: 0,
      totalQuestions: answers.length,

      answers: await Promise.all(
        answers.map(async (answer) => {
          const question = await Question.findById(answer.questionId);

          const isCorrect =
            question.options[question.correctOption] === answer.selectedOption;

          const points = isCorrect ? 10 : 0;

          return {
            question: answer.questionId,
            selectedOption: answer.selectedOption,
            isCorrect,
            points,
            difficulty: question.difficulty,
          };
        }),
      ),

      stats,
    });

    await quizResult.save();
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const eloResult = calculateEloRating({
      currentRating: user.rating,
      quizDifficulty: difficulty || "medium",
      score,
      totalQuestions: answers.length,
    });

    user.rating = eloResult.newRating;

    await user.save();

    res.status(201).json({
      message: "Quiz results submitted successfully",
      elo: eloResult,
      currentRating: user.rating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default quizRoutes;
