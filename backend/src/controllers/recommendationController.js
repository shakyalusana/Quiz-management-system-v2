import { generateRecommendations } from "../utils/recommendation.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const recommendations = await generateRecommendations(userId);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate recommendations",
    });
  }
};
