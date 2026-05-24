import QuizResult from "../models/quiz.js";

/* ----------------------------------------
   CONTENT-BASED RECOMMENDATION
-----------------------------------------*/

export const generateRecommendations = async (userId) => {
  const quizHistory = await QuizResult.find({
    player: userId,
  }).populate("category");

  if (!quizHistory.length) {
    return {
      recommendedCategories: [],
      recommendedDifficulty: "easy",
    };
  }

  /* ----------------------------------------
     CATEGORY ANALYSIS
  -----------------------------------------*/

  const categoryStats = {};

  quizHistory.forEach((quiz) => {
    const categoryId = quiz.category._id.toString();

    if (!categoryStats[categoryId]) {
      categoryStats[categoryId] = {
        category: quiz.category,
        attempts: 0,
        totalScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
      };
    }

    categoryStats[categoryId].attempts += 1;

    categoryStats[categoryId].totalScore += quiz.score;

    categoryStats[categoryId].totalQuestions += quiz.totalQuestions;

    categoryStats[categoryId].correctAnswers += quiz.answers.filter(
      (a) => a.isCorrect,
    ).length;
  });

  /* ----------------------------------------
     INTEREST SCORING
  -----------------------------------------*/

  const scoredCategories = Object.values(categoryStats).map((cat) => {
    const accuracy = (cat.correctAnswers / cat.totalQuestions) * 100;

    const avgScore = (cat.totalScore / cat.totalQuestions) * 100;

    // Weighted Interest Score
    const interestScore = cat.attempts * 0.4 + accuracy * 0.4 + avgScore * 0.2;

    return {
      category: cat.category,
      attempts: cat.attempts,
      accuracy,
      avgScore,
      interestScore,
    };
  });

  /* ----------------------------------------
     SORT BY BEST MATCH
  -----------------------------------------*/

  scoredCategories.sort((a, b) => b.interestScore - a.interestScore);

  /* ----------------------------------------
     DIFFICULTY RECOMMENDATION
  -----------------------------------------*/

  const overallAccuracy =
    scoredCategories.reduce((sum, c) => sum + c.accuracy, 0) /
    scoredCategories.length;

  let recommendedDifficulty = "easy";

  if (overallAccuracy >= 80) {
    recommendedDifficulty = "hard";
  } else if (overallAccuracy >= 50) {
    recommendedDifficulty = "medium";
  }

  return {
    recommendedCategories: scoredCategories.slice(0, 3),

    recommendedDifficulty,
  };
};
