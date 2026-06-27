import Quiz from "../models/quiz.js";

export const collaborativeFiltering = async (userId) => {
  try {
    const userData = await Quiz.find({
      player: userId,
    })
      .populate("category")
      .populate("subcategory");

    const others = await Quiz.find({
      player: {
        $ne: userId,
        $exists: true,
      },
    })
      .populate("player")
      .populate("category")
      .populate("subcategory");

    const validUserData = userData.filter((q) => q.category && q.subcategory);

    const validOthers = others.filter(
      (q) => q.player && q.category && q.subcategory,
    );

    const userVector = {};

    validUserData.forEach((q) => {
      const key = `${q.category._id}_${q.subcategory._id}`;

      userVector[key] = (userVector[key] || 0) + q.score;
    });

    const profiles = {};

    validOthers.forEach((q) => {
      const uid = q.player._id.toString();

      const key = `${q.category._id}_${q.subcategory._id}`;

      if (!profiles[uid]) {
        profiles[uid] = {};
      }

      profiles[uid][key] = (profiles[uid][key] || 0) + q.score;
    });

    const similarity = [];

    for (const [uid, vector] of Object.entries(profiles)) {
      let dot = 0;
      let mag1 = 0;
      let mag2 = 0;

      const keys = new Set([
        ...Object.keys(userVector),
        ...Object.keys(vector),
      ]);

      keys.forEach((key) => {
        const a = userVector[key] || 0;
        const b = vector[key] || 0;

        dot += a * b;
        mag1 += a * a;
        mag2 += b * b;
      });

      const denominator = Math.sqrt(mag1) * Math.sqrt(mag2);

      if (!denominator) continue;

      const sim = dot / denominator;

      if (sim > 0) {
        similarity.push({
          uid,
          sim,
          vector,
        });
      }
    }

    similarity.sort((a, b) => b.sim - a.sim);

    const topUsers = similarity.slice(0, 3);

    const recommendationMap = {};

    topUsers.forEach((user) => {
      Object.entries(user.vector).forEach(([key, score]) => {
        if (!userVector[key]) {
          recommendationMap[key] = (recommendationMap[key] || 0) + score;
        }
      });
    });

    const quizzes = await Quiz.find()
      .populate("category")
      .populate("subcategory");

    const itemMap = {};

    quizzes.forEach((q) => {
      if (q.category && q.subcategory) {
        const key = `${q.category._id}_${q.subcategory._id}`;

        itemMap[key] = {
          category: {
            _id: q.category._id,
            name: q.category.name,
          },
          subCategory: {
            _id: q.subcategory._id,
            name: q.subcategory.name,
          },
        };
      }
    });

    const recommendations = Object.entries(recommendationMap)
      .map(([key, score]) => ({
        ...itemMap[key],
        score,
      }))
      .filter((r) => r.category)
      .sort((a, b) => b.score - a.score);

    return {
      method: "collaborative-filtering",
      similarUsers: topUsers.length,
      recommendedCategories: recommendations,
    };
  } catch (err) {
    console.error(err);

    return {
      method: "collaborative-filtering",
      similarUsers: 0,
      recommendedCategories: [],
    };
  }
};
