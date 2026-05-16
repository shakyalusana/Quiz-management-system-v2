import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import API from "@/request/request";

/* -----------------------------
   QUERY KEYS
------------------------------*/
export const categoryKeys = {
  all: ["categories"] as const,
};

/* -----------------------------
   API FUNCTIONS
------------------------------*/

const getCategories = async () => {
  const { data } = await API.get("/categories");
  return data;
};

const createCategory = async (payload: { name: string }) => {
  const { data } = await API.post("/categories", payload);
  return data;
};

const deleteCategory = async (id: string) => {
  const { data } = await API.delete(`/categories/${id}`);
  return data;
};

/* -----------------------------
   HOOKS
------------------------------*/

export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
};
