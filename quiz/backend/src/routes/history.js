import express from "express";
import QuizResult from "../models/quiz.js";
import auth from "../middleware/authMiddleware.js";

const quizHistory = express.Router();

/* ----------------------------------
   GET QUIZ HISTORY
-----------------------------------*/
quizHistory.get("/all", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await QuizResult.find({ player: userId })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    const formattedHistory = history.map((h) => ({
      _id: h._id,
      score: h.answers.filter((a) => a.isCorrect).length,
      totalQuestions: h.totalQuestions,
      category: h.category,
      createdAt: h.createdAt,
    }));

    return res.json({
      history: formattedHistory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch quiz history",
    });
  }
});

export default quizHistory;
