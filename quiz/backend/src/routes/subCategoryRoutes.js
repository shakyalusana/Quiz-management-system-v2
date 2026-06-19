import express from "express";
import auth from "../middleware/authMiddleware.js";

import {
  getSubCategories,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategoryController.js";

const router = express.Router();

router.get("/", auth, getSubCategories);

router.get("/:id", auth, getSubCategoryById);

router.post("/", auth, createSubCategory);

router.put("/:id", auth, updateSubCategory);

router.delete("/:id", auth, deleteSubCategory);

export default router;
