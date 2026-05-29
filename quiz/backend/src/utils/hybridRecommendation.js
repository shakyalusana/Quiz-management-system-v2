import { contentBasedRecommendation } from "./contentBasedRecommendation.js";
import { collaborativeFiltering } from "./collaborativeFiltering.js";

export const hybridRecommendation = async (userId) => {
  const content = await contentBasedRecommendation(userId);
  const collab = await collaborativeFiltering(userId);

  const merged = {};

  const add = (list, weight) => {
    list.forEach((item, i) => {
      const id = item.category._id;

      if (!merged[id]) {
        merged[id] = {
          category: item.category,
          score: 0,
        };
      }

      merged[id].score += (1 / (i + 1)) * weight;
    });
  };

  add(content.recommendedCategories, 0.6);
  add(collab.recommendedCategories, 0.4);

  const final = Object.values(merged)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    recommendedCategories: final,
    method: "hybrid",
  };
};
