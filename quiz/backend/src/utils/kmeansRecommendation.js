import Quiz from "../models/quiz.js";
import User from "../models/user.js";

// Euclidean Distance
const distance = (a, b) => {
  return Math.sqrt(
    a.reduce((sum, value, index) => sum + Math.pow(value - b[index], 2), 0),
  );
};

// Calculate centroid
const calculateCentroid = (cluster) => {
  const size = cluster[0].length;

  const centroid = [];

  for (let i = 0; i < size; i++) {
    let total = 0;

    cluster.forEach((point) => {
      total += point[i];
    });

    centroid.push(total / cluster.length);
  }

  return centroid;
};

// K Means

const kMeans = (data, k = 3, iterations = 10) => {
  let centroids = data.slice(0, k);

  let clusters = [];

  for (let i = 0; i < iterations; i++) {
    clusters = Array.from({ length: k }, () => []);

    data.forEach((point) => {
      let min = Infinity;

      let index = 0;

      centroids.forEach((center, i) => {
        const d = distance(point, center);

        if (d < min) {
          min = d;
          index = i;
        }
      });

      clusters[index].push(point);
    });

    centroids = clusters.map((cluster) => {
      if (!cluster.length) return centroids[0];

      return calculateCentroid(cluster);
    });
  }

  return clusters;
};

// Main Recommendation

export const kMeansRecommendation = async (userId) => {
  const users = await User.find({
    role: "player",
  });

  const dataset = [];

  for (const user of users) {
    const quizzes = await Quiz.find({
      player: user._id,
    });

    if (!quizzes.length) continue;

    let score = 0;
    let correct = 0;
    let total = 0;

    quizzes.forEach((q) => {
      score += q.score;

      correct += q.stats.correct;

      total += q.totalQuestions;
    });

    dataset.push({
      user: user._id.toString(),

      features: [
        score / quizzes.length,

        (correct / total) * 100,

        quizzes.length,

        user.rating,
      ],
    });
  }

  if (dataset.length < 3) {
    return {
      cluster: null,

      message: "Not enough users",
    };
  }

  const clusters = kMeans(
    dataset.map((d) => d.features),

    3,
  );

  // find current user cluster

  let userCluster = null;

  clusters.forEach((cluster, index) => {
    cluster.forEach((point) => {
      const found = dataset.find((d) => d.features === point);

      if (found && found.user === userId) {
        userCluster = index;
      }
    });
  });

  let difficulty;

  switch (userCluster) {
    case 0:
      difficulty = "easy";

      break;

    case 1:
      difficulty = "medium";

      break;

    case 2:
      difficulty = "hard";

      break;

    default:
      difficulty = "medium";
  }

  return {
    cluster: userCluster,

    recommendedDifficulty: difficulty,

    method: "kmeans",
  };
};
