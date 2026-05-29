import Quiz from "../models/quiz.js";

export const collaborativeFiltering = async (userId) => {
  const userData = await Quiz.find({ player: userId });

  const others = await Quiz.find({ player: { $ne: userId } }).populate(
    "category player",
  );

  const userVector = {};
  userData.forEach((q) => {
    const id = q.category.toString();
    userVector[id] = (userVector[id] || 0) + q.score;
  });

  const profiles = {};

  others.forEach((q) => {
    const uid = q.player._id.toString();
    const cid = q.category._id.toString();

    if (!profiles[uid]) profiles[uid] = {};
    profiles[uid][cid] = (profiles[uid][cid] || 0) + q.score;
  });

  const similarity = [];

  for (const [uid, vector] of Object.entries(profiles)) {
    let dot = 0,
      a = 0,
      b = 0;

    for (const key in userVector) {
      if (vector[key]) {
        dot += userVector[key] * vector[key];
        a += userVector[key] ** 2;
        b += vector[key] ** 2;
      }
    }

    const sim = dot / (Math.sqrt(a) * Math.sqrt(b));

    if (sim) {
      similarity.push({ uid, sim, vector });
    }
  }

  similarity.sort((a, b) => b.sim - a.sim);

  const top = similarity.slice(0, 3);

  const recMap = {};

  top.forEach((user) => {
    Object.entries(user.vector).forEach(([cat, score]) => {
      if (!userVector[cat]) {
        recMap[cat] = (recMap[cat] || 0) + score;
      }
    });
  });

  const recommendations = Object.entries(recMap)
    .map(([cat, score]) => ({ category: cat, score }))
    .sort((a, b) => b.score - a.score);

  return {
    recommendedCategories: recommendations,
    similarUsers: top.length,
  };
};
