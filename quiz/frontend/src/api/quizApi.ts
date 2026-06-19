import { useMutation } from "@tanstack/react-query";
import API from "@/request/request";
import { API_ENDPOINTS } from "@/libs/endPoints";

interface StartQuizPayload {
  categoryId: string;
  subcategoryId: string;
  difficulty: string;
  count: number;
}

interface SubmitQuizPayload {
  categoryId: string;
  subcategoryId: string;
  answers: {
    questionId: string;
    selectedOption: number;
  }[];
  score: number;
}

const quizAPI = {
  startQuiz: async (payload: StartQuizPayload) => {
    const { data } = await API.post(API_ENDPOINTS.QUIZ.GET_QUESTIONS, payload);
    return data;
  },

  submitQuiz: async (payload: SubmitQuizPayload) => {
    const { data } = await API.post(API_ENDPOINTS.QUIZ.SUBMIT_QUIZ, payload);
    return data;
  },
};

export const QUIZAPI = {
  useStartQuiz: () => useMutation({ mutationFn: quizAPI.startQuiz }),
  useSubmitQuiz: () => useMutation({ mutationFn: quizAPI.submitQuiz }),
};
