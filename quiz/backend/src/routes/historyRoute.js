import express from "express";
import {
  getQuizHistory,
  getQuizAuditById,
} from "../controllers/historyController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get("/all", authMiddleware, getQuizHistory);

router.get("/:id", authMiddleware, getQuizAuditById);

export default router;
