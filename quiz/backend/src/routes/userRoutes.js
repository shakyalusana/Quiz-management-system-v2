import express from "express";
import { getAllPlayers } from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all users except superadmin
router.get("/", auth, getAllPlayers);

export default router;
