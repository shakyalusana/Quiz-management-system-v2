import express from "express";
import Quiz from "../models/quiz.js";
import QuizAudit from "../models/quizAudit.js";
import Question from "../models/question.js";
import auth from "../middleware/authMiddleware.js";
import { fisherYatesShuffle } from "../utils/randomizer.js";

// =============== IMPORT ALL ALGORITHMS ===============
import { contentBasedRecommendation } from "../utils/contentBasedRecommendation.js";
import { collaborativeFiltering } from "../utils/collaborativeFiltering.js";
import { kMeansRecommendation } from "../utils/kmeansRecommendation.js";
import { hybridRecommendation } from "../utils/hybridRecommendation.js";
import { aprioriRecommendation } from "../utils/aprioriRecommendation.js";
import { popularityBasedRecommendation } from "../utils/popularityBasedRecommendation.js";

const quizRoutes = express.Router();

/* ===============================================
   QUIZ ENDPOINTS
=============================================== */

/**
 * GET QUESTIONS
 * Fetches and shuffles questions for a quiz
 */
quizRoutes.post("/questions", auth, async (req, res) => {
  try {
    const {
      categoryId,
      subcategoryId,
      difficulty = "medium",
      count = 10,
    } = req.body;

    // ============ VALIDATION ============
    if (!categoryId || !subcategoryId) {
      return res.status(400).json({
        message: "categoryId and subcategoryId are required",
      });
    }

    if (count < 1 || count > 50) {
      return res.status(400).json({
        message: "Count must be between 1 and 50",
      });
    }

    // ============ FETCH QUESTIONS ============
    const questions = await Question.find({
      category: categoryId,
      subcategory: subcategoryId,
      difficulty,
    }).lean();

    if (!questions.length) {
      return res.status(404).json({
        message: `No ${difficulty} questions found for this subcategory`,
        fallback: "Try a different difficulty level",
      });
    }

    // ============ SHUFFLE & FORMAT ============
    const shuffled = fisherYatesShuffle(questions).slice(0, count);

    const formatted = shuffled.map((q) => ({
      _id: q._id,
      text: q.text,
      options: q.options,
      correctOption: q.correctOption,
    }));

    res.json({
      success: true,
      count: formatted.length,
      questions: formatted,
    });
  } catch (err) {
    console.error("Questions fetch error:", err);
    res.status(500).json({
      message: "Error fetching questions",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

/**
 * SUBMIT QUIZ
 * Saves quiz answers and triggers recommendations
 */
quizRoutes.post("/submit", auth, async (req, res) => {
  try {
    const { categoryId, subcategoryId, answers, difficulty } = req.body;

    // ============ VALIDATION ============
    if (!categoryId || !subcategoryId || !answers?.length) {
      return res.status(400).json({
        message: "Missing required fields: categoryId, subcategoryId, answers",
      });
    }

    // ============ VERIFY ANSWERS ============
    const questions = await Question.find({
      _id: { $in: answers.map((a) => a.questionId) },
    });

    if (!questions.length) {
      return res.status(404).json({
        message: "Questions not found",
      });
    }

    // ============ CALCULATE SCORE ============
    let correct = 0;

    const detailedAnswers = answers
      .map((a) => {
        const question = questions.find(
          (q) => q._id.toString() === a.questionId,
        );

        if (!question) return null;

        const isCorrect = question.correctOption === Number(a.selectedOption);

        if (isCorrect) correct++;

        return {
          question: question._id,
          selectedOption: Number(a.selectedOption),
          isCorrect,
          points: isCorrect ? 10 : 0,
          difficulty: question.difficulty,
        };
      })
      .filter(Boolean);

    const score = correct * 10;
    const accuracy = (correct / answers.length) * 100;

    // ============ SAVE QUIZ RECORD ============
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
        accuracy: accuracy.toFixed(2),
      },
      difficulty,
      completedAt: new Date(),
    });

    // ============ AUDIT LOG ============
    await QuizAudit.create({
      quizId: quiz._id,
      user: req.user.id,
      category: categoryId,
      subcategory: subcategoryId,
      score,
      totalQuestions: answers.length,
      accuracy: accuracy.toFixed(2),
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

    // ============ TRIGGER IMMEDIATE RECOMMENDATIONS ============
    // These are fetched separately on the frontend, but you can
    // pre-compute them here for better UX
    const recommendationsCache = {
      contentBased: await contentBasedRecommendation(req.user.id),
      popularity: await popularityBasedRecommendation(),
      // Don't compute heavy algorithms here, let frontend fetch them
    };

    res.json({
      success: true,
      quiz: {
        id: quiz._id,
        score,
        correct,
        wrong: answers.length - correct,
        accuracy: accuracy.toFixed(2),
      },
      recommendations: recommendationsCache,
    });
  } catch (err) {
    console.error("Quiz submit error:", err);
    res.status(500).json({
      message: "Error submitting quiz",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

/* ===============================================
   RECOMMENDATION ENDPOINTS
=============================================== */

/**
 * GET CONTENT-BASED RECOMMENDATIONS
 * Recommends categories based on user's past performance
 */
quizRoutes.get("/recommendations/content-based", auth, async (req, res) => {
  try {
    const result = await contentBasedRecommendation(req.user.id);

    res.json({
      success: true,
      method: "content-based",
      data: result,
    });
  } catch (err) {
    console.error("Content-based error:", err);
    res.status(500).json({ message: "Error generating recommendations" });
  }
});

/**
 * GET COLLABORATIVE FILTERING RECOMMENDATIONS
 * Recommends what similar users enjoyed
 */
quizRoutes.get("/recommendations/collaborative", auth, async (req, res) => {
  try {
    const result = await collaborativeFiltering(req.user.id);

    res.json({
      success: true,
      method: "collaborative",
      data: result,
    });
  } catch (err) {
    console.error("Collaborative filtering error:", err);
    res.status(500).json({ message: "Error generating recommendations" });
  }
});

/**
 * GET POPULARITY-BASED RECOMMENDATIONS
 * Shows trending categories
 */
quizRoutes.get("/recommendations/popularity", auth, async (req, res) => {
  try {
    const result = await popularityBasedRecommendation();

    res.json({
      success: true,
      method: "popularity",
      data: result,
    });
  } catch (err) {
    console.error("Popularity error:", err);
    res.status(500).json({ message: "Error generating recommendations" });
  }
});

/**
 * GET HYBRID RECOMMENDATIONS
 * Combines all algorithms for best result
 */
quizRoutes.get("/recommendations/hybrid", auth, async (req, res) => {
  try {
    const result = await hybridRecommendation(req.user.id);

    res.json({
      success: true,
      method: "hybrid",
      data: result,
    });
  } catch (err) {
    console.error("Hybrid error:", err);
    res.status(500).json({ message: "Error generating recommendations" });
  }
});

/**
 * GET K-MEANS RECOMMENDATIONS
 * Clusters user and recommends difficulty
 */
quizRoutes.get("/recommendations/kmeans", auth, async (req, res) => {
  try {
    const result = await kMeansRecommendation(req.user.id);

    res.json({
      success: true,
      method: "kmeans",
      data: result,
    });
  } catch (err) {
    console.error("K-Means error:", err);
    res.status(500).json({ message: "Error generating recommendations" });
  }
});

/**
 * GET A-PRIORI RECOMMENDATIONS
 * Association rule mining - what to try next based on history
 */
quizRoutes.get("/recommendations/apriori", auth, async (req, res) => {
  try {
    const result = await aprioriRecommendation(req.user.id);

    res.json({
      success: true,
      method: "apriori",
      data: result,
    });
  } catch (err) {
    console.error("Apriori error:", err);
    res.status(500).json({ message: "Error generating recommendations" });
  }
});

/**
 * GET ALL RECOMMENDATIONS (Parallel)
 * Fetch all algorithms at once for performance comparison
 */
quizRoutes.get("/recommendations/all", auth, async (req, res) => {
  try {
    // Run all algorithms in parallel
    const results = await Promise.allSettled([
      contentBasedRecommendation(req.user.id),
      collaborativeFiltering(req.user.id),
      popularityBasedRecommendation(),
      hybridRecommendation(req.user.id),
      kMeansRecommendation(req.user.id),
      aprioriRecommendation(req.user.id),
    ]);

    const algorithms = [
      "content-based",
      "collaborative",
      "popularity",
      "hybrid",
      "kmeans",
      "apriori",
    ];

    const data = {
      contentBased: results[0].status === "fulfilled" ? results[0].value : null,
      collaborative:
        results[1].status === "fulfilled" ? results[1].value : null,
      popularity: results[2].status === "fulfilled" ? results[2].value : null,
      hybrid: results[3].status === "fulfilled" ? results[3].value : null,
      kmeans: results[4].status === "fulfilled" ? results[4].value : null,
      apriori: results[5].status === "fulfilled" ? results[5].value : null,
    };

    res.json({
      success: true,
      method: "all-algorithms",
      data,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("All recommendations error:", err);
    res.status(500).json({ message: "Error generating recommendations" });
  }
});

/* ===============================================
   ANALYTICS ENDPOINTS
=============================================== */

/**
 * GET USER QUIZ HISTORY
 */
quizRoutes.get("/history", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const quizzes = await Quiz.find({ player: req.user.id })
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Quiz.countDocuments({ player: req.user.id });

    res.json({
      success: true,
      data: quizzes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ message: "Error fetching history" });
  }
});

/**
 * GET USER STATISTICS
 */
quizRoutes.get("/stats", auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ player: req.user.id });

    if (!quizzes.length) {
      return res.json({
        success: true,
        stats: {
          totalQuizzes: 0,
          totalScore: 0,
          averageScore: 0,
          averageAccuracy: 0,
          totalCorrect: 0,
          totalQuestions: 0,
          streak: 0,
          bestScore: 0,
        },
      });
    }

    const totalCorrect = quizzes.reduce((sum, q) => sum + q.stats.correct, 0);
    const totalQuestions = quizzes.reduce((sum, q) => sum + q.stats.total, 0);
    const totalScore = quizzes.reduce((sum, q) => sum + q.score, 0);

    res.json({
      success: true,
      stats: {
        totalQuizzes: quizzes.length,
        totalScore,
        averageScore: (totalScore / quizzes.length).toFixed(2),
        averageAccuracy: ((totalCorrect / totalQuestions) * 100).toFixed(2),
        totalCorrect,
        totalQuestions,
        bestScore: Math.max(...quizzes.map((q) => q.score)),
        lastQuizDate: quizzes[0].completedAt,
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

export default quizRoutes;
