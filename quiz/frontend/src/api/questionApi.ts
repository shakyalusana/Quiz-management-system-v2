import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import API from "@/request/request";
import { API_ENDPOINTS } from "@/libs/endPoints";

/* ----------------------------------
   QUERY KEYS
-----------------------------------*/
export const questionKeys = {
  all: ["questions"] as const,
  list: () => [...questionKeys.all, "list"] as const,
  create: () => [...questionKeys.all, "create"] as const,
  update: () => [...questionKeys.all, "update"] as const,
  delete: () => [...questionKeys.all, "delete"] as const,
} as const;

/* ----------------------------------
   API FUNCTIONS
-----------------------------------*/
const questionAPI = {
  getQuestions: async () => {
    const { data } = await API.get(API_ENDPOINTS.QUESTION.GET_ALL);

    return data;
  },

  createQuestion: async (payload: Record<string, unknown>) => {
    const { data } = await API.post(API_ENDPOINTS.QUESTION.CREATE, payload);

    return data;
  },

  updateQuestion: async ({
    id,
    payload,
  }: {
    id: string;
    payload: Record<string, unknown>;
  }) => {
    const { data } = await API.put(API_ENDPOINTS.QUESTION.UPDATE(id), payload);

    return data;
  },

  deleteQuestion: async (id: string) => {
    const { data } = await API.delete(API_ENDPOINTS.QUESTION.DELETE(id));

    return data;
  },
} as const;

/* ----------------------------------
   HOOKS
-----------------------------------*/

const useQuestions = () => {
  return useQuery({
    queryKey: questionKeys.list(),
    queryFn: questionAPI.getQuestions,
  });
};

const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionAPI.createQuestion,

    meta: {
      errorMessage: "Failed to create question",
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.all,
      });
    },
  });
};

const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionAPI.updateQuestion,

    meta: {
      errorMessage: "Failed to update question",
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.all,
      });
    },
  });
};

const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionAPI.deleteQuestion,

    meta: {
      errorMessage: "Failed to delete question",
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.all,
      });
    },
  });
};

/* ----------------------------------
   EXPORT
-----------------------------------*/

export const QUESTIONAPI = {
  useQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} as const;
