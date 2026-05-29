import { contentBasedRecommendation } from "./contentBasedRecommendation.js";
import { collaborativeFiltering } from "./collaborativeFiltering.js";

export const hybridRecommendation = async (userId) => {
  const content = await contentBasedRecommendation(userId);
  const collab = await collaborativeFiltering(userId);

  const merged = {};

  content.recommendedCategories.forEach((c, i) => {
    merged[c.category] = (merged[c.category] || 0) + (1 / (i + 1)) * 0.6;
  });

  collab.recommendedCategories.forEach((c, i) => {
    merged[c.category] = (merged[c.category] || 0) + (1 / (i + 1)) * 0.4;
  });

  const final = Object.entries(merged)
    .map(([cat, score]) => ({ category: cat, score }))
    .sort((a, b) => b.score - a.score);

  return {
    recommendedCategories: final.slice(0, 5),
    method: "hybrid",
  };
};
