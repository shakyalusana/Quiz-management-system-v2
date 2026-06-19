import User from "../models/User.js";
import Quiz from "../models/Quiz.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      {
        $match: {
          role: "player",
        },
      },

      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "player",
          as: "quizzes",
        },
      },

      {
        $addFields: {
          totalQuizzes: {
            $size: "$quizzes",
          },

          totalScore: {
            $sum: "$quizzes.score",
          },

          averageScore: {
            $cond: [
              {
                $gt: [{ $size: "$quizzes" }, 0],
              },
              {
                $avg: "$quizzes.score",
              },
              0,
            ],
          },

          totalCorrect: {
            $sum: "$quizzes.stats.correct",
          },

          totalQuestions: {
            $sum: "$quizzes.stats.total",
          },
        },
      },

      {
        $addFields: {
          winRate: {
            $cond: [
              {
                $gt: ["$totalQuestions", 0],
              },
              {
                $multiply: [
                  {
                    $divide: ["$totalCorrect", "$totalQuestions"],
                  },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },

      {
        $project: {
          password: 0,
          quizzes: 0,
        },
      },

      {
        $sort: {
          winRate: -1,
          rating: -1,
          totalScore: -1,
          averageScore: -1,
        },
      },
    ]);

    const rankedLeaderboard = leaderboard.map((player, index) => ({
      rank: index + 1,
      ...player,
    }));

    res.status(200).json({
      success: true,
      count: rankedLeaderboard.length,
      leaderboard: rankedLeaderboard,
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error.message,
    });
  }
};
