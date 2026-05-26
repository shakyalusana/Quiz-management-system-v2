import mongoose from "mongoose";

const quizAuditSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    score: Number,
    totalQuestions: Number,

    audit: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: Number,
        correctOption: Number,
        isCorrect: Boolean,
        difficulty: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("QuizAudit", quizAuditSchema);
