const mongoose = require("mongoose");
const Question = require("../models/question");

function fisherYatesShuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function determineUserSkillLevel(userProfile) {
  if (!userProfile?.recentPerformance) {
    return "medium";
  }

  const successRate =
    userProfile.recentPerformance.correct / userProfile.recentPerformance.total;

  if (successRate >= 0.8) {
    return "hard";
  } else if (successRate >= 0.5) {
    return "medium";
  } else {
    return "easy";
  }
}

/**
 * Get questions distribution based on user's skill level
 * @param {String} userSkillLevel - User's current skill level
 * @returns {Object} - Distribution of questions by difficulty
 */
function getQuestionDistribution(userSkillLevel) {
  const distributions = {
    easy: { easy: 0.7, medium: 0.3, hard: 0 },
    medium: { easy: 0.2, medium: 0.6, hard: 0.2 },
    hard: { easy: 0, medium: 0.3, hard: 0.7 },
  };

  return distributions[userSkillLevel];
}

function selectQuestionsByDifficulty(questions, distribution, count) {
  // Group questions by difficulty
  const questionsByDifficulty = {
    easy: questions.filter((q) => q.difficulty === "easy"),
    medium: questions.filter((q) => q.difficulty === "medium"),
    hard: questions.filter((q) => q.difficulty === "hard"),
  };

  // Calculate how many questions we need from each difficulty
  const questionCounts = {
    easy: Math.round(count * distribution.easy),
    medium: Math.round(count * distribution.medium),
    hard: Math.round(count * distribution.hard),
  };

  // Adjust counts if they don't sum up to the requested count
  const totalSelected = Object.values(questionCounts).reduce(
    (a, b) => a + b,
    0,
  );
  if (totalSelected < count) {
    questionCounts[userSkillLevel] += count - totalSelected;
  }

  // Select questions from each difficulty level
  let selectedQuestions = [];
  Object.entries(questionCounts).forEach(([difficulty, difficultyCount]) => {
    if (difficultyCount > 0) {
      const availableQuestions = questionsByDifficulty[difficulty];
      const shuffled = fisherYatesShuffle(availableQuestions);
      selectedQuestions = selectedQuestions.concat(
        shuffled.slice(0, Math.min(difficultyCount, shuffled.length)),
      );
    }
  });

  return fisherYatesShuffle(selectedQuestions);
}

async function getRandomQuestions(categoryId, count, userProfile = null) {
  try {
    // Input validation
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Invalid category ID");
    }
    if (typeof count !== "number" || count <= 0) {
      throw new TypeError("Count must be a positive number");
    }

    // Fetch questions from database
    const questions = await Question.find({ category: categoryId })
      .select("-__v")
      .lean();

    // Validate questions array
    if (!questions || questions.length === 0) {
      throw new Error("No questions found for the given category");
    }
    if (count > questions.length) {
      throw new RangeError(
        `Requested ${count} questions but only ${questions.length} available`,
      );
    }

    // If user profile is provided, use adaptive difficulty
    if (userProfile) {
      const userSkillLevel = determineUserSkillLevel(userProfile);
      const distribution = getQuestionDistribution(userSkillLevel);
      return selectQuestionsByDifficulty(questions, distribution, count);
    }

    // Fallback to pure random selection if no user profile
    return fisherYatesShuffle(questions).slice(0, count);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRandomQuestions,
  fisherYatesShuffle,
  // Export for testing
  determineUserSkillLevel,
  getQuestionDistribution,
  selectQuestionsByDifficulty,
};
