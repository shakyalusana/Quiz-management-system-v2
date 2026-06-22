import express from "express";
import {
  getRecommendations,
  getAprioriRecommendation,
} from "../controllers/recommendationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Example:
// GET /api/recommendations?type=content
// GET /api/recommendations?type=collaborative
// GET /api/recommendations?type=popular
// GET /api/recommendations?type=hybrid

router.get("/", authMiddleware, getRecommendations);
router.get("/apriori", authMiddleware, getAprioriRecommendation);
export default router;
