import express from "express";
import mongoose from "mongoose";

import Question from "../models/question.js";
import auth from "../middleware/authMiddleware.js";
import validateQuestion from "../middleware/validateQuestion.js";

const questionRoutes = express.Router();

// PUBLIC route - Get quiz questions
questionRoutes.get("/quiz", async (req, res) => {
  try {
    const { categoryId, count = 5 } = req.query;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const questions = await Question.aggregate([
      { $match: { category: new mongoose.Types.ObjectId(categoryId) } },
      { $sample: { size: Number(count) } },
    ]);

    await Question.populate(questions, { path: "category", select: "name" });

    res.json(questions);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PROTECTED routes (admin only)
questionRoutes.get("/", auth, async (req, res) => {
  try {
    // Pagination values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search value
    const search = req.query.search || "";

    // Search query
    const query = search
      ? {
          $or: [
            { question: { $regex: search, $options: "i" } },
            { answer: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Fetch questions
    const questions = await Question.find(query)
      .populate("category")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Total count for pagination
    const totalQuestions = await Question.countDocuments(query);

    res.json({
      success: true,
      data: questions,
      pagination: {
        totalItems: totalQuestions,
        currentPage: page,
        totalPages: Math.ceil(totalQuestions / limit),
        pageSize: limit,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

questionRoutes.get("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "category",
      "name",
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid question ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Get questions by difficulty
questionRoutes.get("/difficulty/:level", auth, async (req, res) => {
  try {
    const { level } = req.params;
    if (!["easy", "medium", "hard"].includes(level)) {
      return res.status(400).json({ message: "Invalid difficulty level" });
    }
    const questions = await Question.find({ difficulty: level }).populate(
      "category",
    );
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get question count for a category
questionRoutes.get("/count/:categoryId", auth, async (req, res) => {
  try {
    const count = await Question.countDocuments({
      category: req.params.categoryId,
    });
    res.json({ count });
  } catch (error) {
    console.error("Error getting question count:", error);
    res.status(500).json({ message: "Error getting question count" });
  }
});

questionRoutes.post("/", [auth, validateQuestion], async (req, res) => {
  try {
    const { text, options, correctOption, category, subcategory, difficulty } =
      req.body;
    const question = new Question({
      text,
      options,
      correctOption,
      category,
      subcategory,
      difficulty,
    });

    const newQuestion = await question.save();
    await newQuestion.populate("category");
    await newQuestion.populate("subcategory");
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

questionRoutes.put("/:id", [auth, validateQuestion], async (req, res) => {
  try {
    const { text, options, correctOption, category, subcategory, difficulty } =
      req.body;
    const updates = {};

    if (text) updates.text = text;
    if (options) updates.options = options;
    if (correctOption !== undefined) updates.correctOption = correctOption;
    if (category) updates.category = category;
    if (subcategory) updates.subcategory = subcategory;
    if (difficulty) updates.difficulty = difficulty;

    const question = await Question.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    })
      .populate("category")
      .populate("subcategory");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

questionRoutes.delete("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    await question.deleteOne();
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default questionRoutes;
