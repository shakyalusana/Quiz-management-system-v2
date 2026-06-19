import express from "express";
import Quiz from "../models/quiz.js";
import QuizAudit from "../models/quizAudit.js";
import Question from "../models/question.js";
import auth from "../middleware/authMiddleware.js";
import { fisherYatesShuffle } from "../utils/randomizer.js";

const quizRoutes = express.Router();

/* ---------------- GET QUESTIONS ---------------- */
quizRoutes.post("/questions", auth, async (req, res) => {
  try {
    const {
      categoryId,
      subcategoryId,
      difficulty = "medium",
      count = 10,
    } = req.body;

    const questions = await Question.find({
      category: categoryId,
      subcategory: subcategoryId,
      difficulty,
    }).lean();

    if (!questions.length) {
      return res.status(404).json({ message: "No questions found" });
    }

    const shuffled = fisherYatesShuffle(questions).slice(0, count);

    const formatted = shuffled.map((q) => ({
      _id: q._id,
      text: q.text,
      options: q.options,
      correctOption: q.correctOption, // optional for frontend review
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- SUBMIT QUIZ ---------------- */
quizRoutes.post("/submit", auth, async (req, res) => {
  try {
    const { categoryId, subcategoryId, answers, difficulty } = req.body;

    const questions = await Question.find({
      _id: { $in: answers.map((a) => a.questionId) },
    });

    let correct = 0;

    const detailedAnswers = answers.map((a) => {
      const question = questions.find((q) => q._id.toString() === a.questionId);

      const isCorrect = question.correctOption === Number(a.selectedOption);

      if (isCorrect) correct++;

      return {
        question: question._id,
        selectedOption: Number(a.selectedOption),
        isCorrect,
        points: isCorrect ? 10 : 0,
        difficulty: question.difficulty,
      };
    });

    const score = correct * 10;

    // ---------------- SAVE QUIZ ----------------
    const quiz = await Quiz.create({
      player: req.user.id,
      category: categoryId,
      subcategory: subcategoryId,
      score,
      totalQuestions: answers.length,
      answers: detailedAnswers,
      stats: {
        correct,
        wrong: answers.length - correct,
        total: answers.length,
      },
    });

    // ---------------- AUDIT LOG ----------------
    await QuizAudit.create({
      quizId: quiz._id,
      user: req.user.id,
      category: categoryId,
      subcategory: subcategoryId,
      score,
      totalQuestions: answers.length,

      audit: answers.map((a) => {
        const q = questions.find((x) => x._id.toString() === a.questionId);

        return {
          questionId: q._id,
          selectedOption: Number(a.selectedOption),
          correctOption: q.correctOption,
          isCorrect: q.correctOption === Number(a.selectedOption),
          difficulty: q.difficulty,
        };
      }),
    });

    res.json({
      score,
      correct,
      wrong: answers.length - correct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default quizRoutes;
