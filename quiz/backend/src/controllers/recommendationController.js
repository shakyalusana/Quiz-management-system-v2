import { contentBasedRecommendation } from "../utils/contentBasedRecommendation.js";
import { collaborativeFiltering } from "../utils/collaborativeFiltering.js";
import { popularityBasedRecommendation } from "../utils/popularityBasedRecommendation.js";
import { hybridRecommendation } from "../utils/hybridRecommendation.js";
import { kMeansRecommendation } from "../utils/kmeansRecommendation.js";

/* ----------------------------------------
   MAIN CONTROLLER
-----------------------------------------*/

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const type = req.query.type || "content";

    let result;

    switch (type) {
      case "content":
        result = await contentBasedRecommendation(userId);
        break;

      case "collaborative":
        result = await collaborativeFiltering(userId);
        break;

      case "popular":
        result = await popularityBasedRecommendation();
        break;

      case "hybrid":
        result = await hybridRecommendation(userId);
        break;

      case "kmeans":
        result = await kMeansRecommendation(userId);
        break;

      default:
        return res.status(400).json({
          message:
            "Invalid type. Use content | collaborative | popular | hybrid",
        });
    }

    res.status(200).json({
      type,
      result,
    });
  } catch (error) {
    console.error("Recommendation Error:", error);

    res.status(500).json({
      message: "Failed to generate recommendations",
    });
  }
};
