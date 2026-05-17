import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import questionRoutes from "./routes/questions.js";
import quizRoutes from "./routes/quizRoute.js";
import playerRoutes from "./routes/playerRoute.js";
import authAdminRoute from "./routes/adminRoute.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import listEndpoints from "express-list-endpoints";

dotenv.config({ path: "../.env" });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/player", playerRoutes);
app.use("/api", recommendationRoutes);
app.use("/api/admin", authAdminRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  console.log("📡 Registered Routes:");
  console.table(listEndpoints(app));
});
