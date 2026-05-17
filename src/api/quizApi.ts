import { useMutation } from "@tanstack/react-query";

import API from "@/request/request";
import { API_ENDPOINTS } from "@/libs/endPoints";

/* ----------------------------------
   QUERY KEYS
-----------------------------------*/

export const quizKeys = {
  all: ["quiz"] as const,

  questions: () => [...quizKeys.all, "questions"] as const,

  submit: () => [...quizKeys.all, "submit"] as const,
} as const;

/* ----------------------------------
   TYPES
-----------------------------------*/

interface StartQuizPayload {
  categoryId: string;
  difficulty: string;
  count: number;
}

interface SubmitQuizPayload {
  categoryId: string;

  answers: {
    questionId: string;
    selectedOption: string;
  }[];

  score: number;

  stats: {
    total: number;
  };
}

/* ----------------------------------
   API FUNCTIONS
-----------------------------------*/

const quizAPI = {
  startQuiz: async (payload: StartQuizPayload) => {
    const { data } = await API.post(API_ENDPOINTS.QUIZ.GET_QUESTIONS, payload);

    return data;
  },

  submitQuiz: async (payload: SubmitQuizPayload) => {
    const { data } = await API.post(API_ENDPOINTS.QUIZ.SUBMIT_QUIZ, payload);

    return data;
  },
} as const;

/* ----------------------------------
   HOOKS
-----------------------------------*/

const useStartQuiz = () => {
  return useMutation({
    mutationFn: quizAPI.startQuiz,

    meta: {
      errorMessage: "Failed to start quiz",
    },
  });
};

const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: quizAPI.submitQuiz,

    meta: {
      errorMessage: "Failed to submit quiz",
    },
  });
};

/* ----------------------------------
   EXPORT
-----------------------------------*/

export const QUIZAPI = {
  useStartQuiz,
  useSubmitQuiz,
} as const;
