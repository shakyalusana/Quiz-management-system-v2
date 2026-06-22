import Quiz from "../models/quiz.js";

export const collaborativeFiltering = async (userId) => {
  try {
    /*
      1. Get current user's quiz history
    */
    const userData = await Quiz.find({
      player: userId,
    }).populate("category");

    /*
      2. Get other users' quiz history
    */
    const others = await Quiz.find({
      player: {
        $ne: userId,
        $exists: true,
      },
    })
      .populate("category")
      .populate("player");

    /*
      Remove broken references
      player === null
      category === null
    */
    const validUserData = userData.filter((q) => q.category);

    const validOthers = others.filter((q) => q.player && q.category);

    /*
      3. Create current user's category vector

      Example:

      {
        sports: 150,
        science: 80
      }

    */
    const userVector = {};

    validUserData.forEach((q) => {
      const categoryId = q.category._id.toString();

      userVector[categoryId] = (userVector[categoryId] || 0) + q.score;
    });

    /*
      4. Create other users profiles

      {
        user1:{
          category1:100,
          category2:80
        }
      }

    */
    const profiles = {};

    validOthers.forEach((q) => {
      const userId = q.player._id.toString();

      const categoryId = q.category._id.toString();

      if (!profiles[userId]) {
        profiles[userId] = {};
      }

      profiles[userId][categoryId] =
        (profiles[userId][categoryId] || 0) + q.score;
    });

    /*
      5. Calculate cosine similarity
    */

    const similarity = [];

    for (const [uid, vector] of Object.entries(profiles)) {
      let dot = 0;

      let userMagnitude = 0;

      let otherMagnitude = 0;

      for (const key in userVector) {
        const userScore = userVector[key] || 0;

        const otherScore = vector[key] || 0;

        dot += userScore * otherScore;

        userMagnitude += userScore ** 2;

        otherMagnitude += otherScore ** 2;
      }

      const denominator = Math.sqrt(userMagnitude) * Math.sqrt(otherMagnitude);

      // avoid divide by zero
      if (!denominator) {
        continue;
      }

      const similarityScore = dot / denominator;

      if (similarityScore > 0) {
        similarity.push({
          uid,

          sim: similarityScore,

          vector,
        });
      }
    }

    /*
      6. Sort most similar users
    */

    similarity.sort((a, b) => b.sim - a.sim);

    const topUsers = similarity.slice(0, 3);

    /*
      7. Generate recommendations
    */

    const recommendationMap = {};

    topUsers.forEach((user) => {
      Object.entries(user.vector).forEach(([categoryId, score]) => {
        // avoid recommending already known categories
        if (!userVector[categoryId]) {
          recommendationMap[categoryId] =
            (recommendationMap[categoryId] || 0) + score;
        }
      });
    });

    /*
      8. Convert category IDs to category objects
    */

    const allCategories = await Quiz.find().populate("category");

    const categoryMap = {};

    allCategories.forEach((q) => {
      if (q.category) {
        categoryMap[q.category._id.toString()] = q.category;
      }
    });

    /*
      9. Final recommendation list
    */

    const recommendations = Object.entries(recommendationMap)

      .map(([categoryId, score]) => ({
        category: categoryMap[categoryId],

        score,
      }))

      .filter((item) => item.category)

      .sort((a, b) => b.score - a.score);

    return {
      recommendedCategories: recommendations,

      similarUsers: topUsers.length,

      method: "collaborative-filtering",
    };
  } catch (error) {
    console.error("Collaborative Filtering Error:", error);

    return {
      recommendedCategories: [],

      similarUsers: 0,

      method: "collaborative-filtering",
    };
  }
};
