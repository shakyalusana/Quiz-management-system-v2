import express from "express";
import Category from "../models/category.js";
import auth from "../middleware/authMiddleware.js";

const categoryRoutes = express.Router();

// Get all categories
categoryRoutes.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new category (admin only)
categoryRoutes.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    let category = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (category) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create new category
    category = new Category({ name });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a category (admin only)
categoryRoutes.put("/:id", auth, async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category exists
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update category
    category.name = name;
    await category.save();

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a category (admin only)
categoryRoutes.delete("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default categoryRoutes;
