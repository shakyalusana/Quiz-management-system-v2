import Quiz from "../models/quiz.js";

export const popularityBasedRecommendation = async () => {
  const quizzes = await Quiz.find()
    .populate("category")
    .populate("subcategory");

  const popularity = {};

  quizzes.forEach((q) => {
    const key = `${q.category._id}_${q.subcategory._id}`;

    if (!popularity[key]) {
      popularity[key] = {
        category: q.category,
        subcategory: q.subcategory,
        attempts: 0,
        totalScore: 0,
      };
    }

    popularity[key].attempts++;
    popularity[key].totalScore += q.score;
  });

  const result = Object.values(popularity)
    .map((item) => ({
      category: {
        _id: item.category._id,
        name: item.category.name,
      },
      subcategory: {
        _id: item.subcategory._id,
        name: item.subcategory.name,
      },
      score: item.totalScore + item.attempts * 10,
    }))
    .sort((a, b) => b.score - a.score);

  return {
    recommendedCategories: result.slice(0, 5),
  };
};
