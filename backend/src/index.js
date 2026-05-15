import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoute.js";

import protect from "./middleware/authMiddleware.js";

import superAdminOnly from "./middleware/roleMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// PLAYER ROUTE
app.get("/api/player", protect, (req, res) => {
  res.json({
    message: "Player Dashboard",
    user: req.user,
  });
});

// SUPERADMIN ROUTE
app.get("/api/admin", protect, superAdminOnly, (req, res) => {
  res.json({
    message: "Welcome Super Admin",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
