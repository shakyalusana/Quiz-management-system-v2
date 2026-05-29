import Quiz from "../models/quiz.js";

export const popularityBasedRecommendation = async () => {
  const quizzes = await Quiz.find().populate("category");

  const popularity = {};

  quizzes.forEach((q) => {
    const id = q.category._id.toString();

    if (!popularity[id]) {
      popularity[id] = {
        category: q.category,
        attempts: 0,
        totalScore: 0,
      };
    }

    popularity[id].attempts++;
    popularity[id].totalScore += q.score;
  });

  const result = Object.values(popularity).map((p) => ({
    category: {
      _id: p.category._id,
      name: p.category.name,
    },
    score: p.totalScore + p.attempts * 10,
  }));

  return {
    recommendedCategories: result.slice(0, 5),
  };
};
