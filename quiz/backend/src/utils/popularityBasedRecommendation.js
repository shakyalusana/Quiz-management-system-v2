import Quiz from "../models/quiz.js";

export const popularityBasedRecommendation = async () => {
  const quizzes = await Quiz.find().populate("category");

  const popularity = {};

  quizzes.forEach((q) => {
    const id = q.category._id.toString();

    if (!popularity[id]) {
      popularity[id] = {
        attempts: 0,
        totalScore: 0,
      };
    }

    popularity[id].attempts++;
    popularity[id].totalScore += q.score;
  });

  const result = Object.entries(popularity).map(([id, data]) => ({
    category: id,
    popularityScore: data.attempts + data.totalScore / 10,
  }));

  result.sort((a, b) => b.popularityScore - a.popularityScore);

  return {
    recommendedCategories: result.slice(0, 5),
  };
};
