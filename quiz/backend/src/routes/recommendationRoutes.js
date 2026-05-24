import express from "express";

import { getRecommendations } from "../controllers/recommendationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const recommendationRoutes = express.Router();

recommendationRoutes.get(
  "/recommendations",
  authMiddleware,
  getRecommendations,
);

export default recommendationRoutes;
