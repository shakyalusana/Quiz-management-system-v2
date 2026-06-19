import Category from "../models/category.js";
import SubCategory from "../models/subCategory.js";

/* ---------------- GET ALL ---------------- */
export const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const filter = {};

    if (categoryId) {
      filter.category = categoryId;
    }

    const subcategories = await SubCategory.find(filter)
      .populate("category", "name")
      .sort("name");

    res.json(subcategories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ---------------- GET BY ID ---------------- */
export const getSubCategoryById = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id).populate(
      "category",
      "name",
    );

    if (!subcategory) {
      return res.status(404).json({
        message: "SubCategory not found",
      });
    }

    res.json(subcategory);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ---------------- CREATE ---------------- */
export const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const exists = await SubCategory.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      category,
    });

    if (exists) {
      return res.status(400).json({
        message: "SubCategory already exists",
      });
    }

    const subcategory = await SubCategory.create({
      name,
      category,
    });

    await subcategory.populate("category", "name");

    res.status(201).json(subcategory);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ---------------- UPDATE ---------------- */
export const updateSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    const subcategory = await SubCategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        message: "SubCategory not found",
      });
    }

    if (name) subcategory.name = name;
    if (category) subcategory.category = category;

    await subcategory.save();

    await subcategory.populate("category", "name");

    res.json(subcategory);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ---------------- DELETE ---------------- */
export const deleteSubCategory = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        message: "SubCategory not found",
      });
    }

    await SubCategory.findByIdAndDelete(req.params.id);

    res.json({
      message: "SubCategory deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
