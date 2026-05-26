import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoute";
import categoryRoutes from "./routes/categoryRoute.js";
import questionRoutes from "./routes/questions.js";
import quizRoutes from "./routes/quizRoute.js";
import playerRoutes from "./routes/playerRoute.js";
import authAdminRoute from "./routes/adminRoute.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import historyRoutes from "./routes/historyRoute";

dotenv.config({ path: "../.env" });

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/player", playerRoutes);
app.use("/api", recommendationRoutes);
app.use("/api/admin", authAdminRoute);
app.use("/api/history", historyRoutes); // Add this line to include the history route

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
