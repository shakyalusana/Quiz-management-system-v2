import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { questionApi, questionKeys } from "@/api/questionApi";

export const useQuestions = () => {
  return useQuery({
    queryKey: questionKeys.all,
    queryFn: questionApi.getQuestions,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionApi.createQuestion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.all,
      });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionApi.deleteQuestion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.all,
      });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionApi.updateQuestion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.all,
      });
    },
  });
};
