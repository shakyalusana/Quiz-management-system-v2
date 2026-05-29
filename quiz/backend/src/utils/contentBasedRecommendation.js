import Quiz from "../models/quiz.js";

export const contentBasedRecommendation = async (userId) => {
  const quizzes = await Quiz.find({ player: userId }).populate("category");

  if (!quizzes.length) {
    return { recommendedCategories: [], recommendedDifficulty: "easy" };
  }

  const stats = {};

  quizzes.forEach((q) => {
    const id = q.category._id.toString();

    if (!stats[id]) {
      stats[id] = { attempts: 0, correct: 0, total: 0 };
    }

    stats[id].attempts++;
    stats[id].correct += q.answers.filter((a) => a.isCorrect).length;
    stats[id].total += q.totalQuestions;
  });

  const result = Object.values(stats).map((cat) => {
    const accuracy = (cat.correct / cat.total) * 100;

    const score = cat.attempts * 0.4 + accuracy * 0.6;

    return { category: cat, accuracy, score };
  });

  result.sort((a, b) => b.score - a.score);

  return {
    recommendedCategories: result.slice(0, 3),
  };
};
