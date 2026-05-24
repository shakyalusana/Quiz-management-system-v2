/* -----------------------------------------
   QUIZ DIFFICULTY RATINGS
------------------------------------------*/

export const QUIZ_RATINGS = {
  easy: 800,
  medium: 1200,
  hard: 1600,
};

/* -----------------------------------------
   ELO RATING ALGORITHM
------------------------------------------*/

export const calculateEloRating = ({
  currentRating,
  quizDifficulty,
  score,
  totalQuestions,
}) => {
  const K = 32;

  const quizRating = QUIZ_RATINGS[quizDifficulty] || 1200;

  /* -----------------------------------------
     EXPECTED SCORE
  ------------------------------------------*/

  const expectedScore =
    1 / (1 + Math.pow(10, (quizRating - currentRating) / 400));

  /* -----------------------------------------
     ACTUAL SCORE %
  ------------------------------------------*/

  const percentage = totalQuestions === 0 ? 0 : (score / totalQuestions) * 100;

  let actualScore = 0;

  // Win
  if (percentage >= 80) {
    actualScore = 1;
  }

  // Draw
  else if (percentage >= 50) {
    actualScore = 0.5;
  }

  // Loss
  else {
    actualScore = 0;
  }

  /* -----------------------------------------
     NEW RATING
  ------------------------------------------*/

  const newRating = currentRating + K * (actualScore - expectedScore);

  return {
    oldRating: currentRating,

    newRating: Math.round(newRating),

    gained: Math.round(newRating) - currentRating,

    percentage,
  };
};
