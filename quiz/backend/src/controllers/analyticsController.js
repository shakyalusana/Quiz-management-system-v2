import Quiz from "../models/quiz.js";

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const quizzes = await Quiz.find({ player: userId });

    if (!quizzes.length) {
      return res.status(200).json({
        totalScore: 0,
        accuracy: 0,
        streak: 0,
        badges: 0,
        totalQuizzes: 0,
      });
    }

    let totalScore = 0;
    let correct = 0;
    let totalQuestions = 0;

    quizzes.forEach((q) => {
      totalScore += q.score;
      correct += q.stats?.correct || 0;
      totalQuestions += q.totalQuestions;
    });

    const accuracy = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;

    // Simple streak logic (last 7 quizzes correct rate)
    const lastQuizzes = quizzes.slice(-7);
    const streak = lastQuizzes.filter((q) => q.score > 50).length;

    // Badge logic (simple gamification rule)
    let badges = 0;
    if (totalScore > 1000) badges++;
    if (totalScore > 3000) badges++;
    if (accuracy > 70) badges++;
    if (streak >= 5) badges++;

    return res.status(200).json({
      totalScore,
      accuracy: Number(accuracy.toFixed(2)),
      streak,
      badges,
      totalQuizzes: quizzes.length,
    });
  } catch (error) {
    console.error("Stats Error:", error);

    res.status(500).json({
      message: "Failed to fetch user stats",
    });
  }
};
