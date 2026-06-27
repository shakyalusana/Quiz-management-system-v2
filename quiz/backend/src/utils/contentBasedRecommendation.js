import Quiz from "../models/quiz.js";

export const contentBasedRecommendation = async (userId) => {
  const quizzes = await Quiz.find({
    player: userId,
  })
    .populate("category")
    .populate("subcategory");

  if (!quizzes.length) {
    return {
      recommendedCategories: [],
    };
  }

  const stats = {};

  quizzes.forEach((q) => {
    const key = `${q.category._id}_${q.subcategory._id}`;

    if (!stats[key]) {
      stats[key] = {
        category: q.category,
        subcategory: q.subcategory,
        attempts: 0,
        correct: 0,
        total: 0,
      };
    }

    stats[key].attempts++;

    stats[key].correct += q.answers.filter((a) => a.isCorrect).length;

    stats[key].total += q.totalQuestions;
  });

  const result = Object.values(stats).map((item) => {
    const accuracy = item.total === 0 ? 0 : (item.correct / item.total) * 100;

    const score = accuracy * 0.6 + item.attempts * 0.4;

    return {
      category: {
        _id: item.category._id,
        name: item.category.name,
      },
      subcategory: {
        _id: item.subcategory._id,
        name: item.subcategory.name,
      },
      accuracy,
      score,
    };
  });

  result.sort((a, b) => b.score - a.score);

  return {
    recommendedCategories: result.slice(0, 3),
  };
};
