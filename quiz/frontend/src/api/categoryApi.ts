import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import API from "@/request/request";
import { API_ENDPOINTS } from "@/libs/endPoints";

/* ----------------------------------
   QUERY KEYS
-----------------------------------*/
export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  create: () => [...categoryKeys.all, "create"] as const,
  delete: () => [...categoryKeys.all, "delete"] as const,
} as const;

/* ----------------------------------
   API FUNCTIONS
-----------------------------------*/
const categoryAPI = {
  getCategories: async () => {
    const { data } = await API.get(API_ENDPOINTS.CATEGORY.GET_ALL);

    return data;
  },

  createCategory: async (payload: { name: string }) => {
    const { data } = await API.post(API_ENDPOINTS.CATEGORY.CREATE, payload);

    return data;
  },

  deleteCategory: async (id: string) => {
    const { data } = await API.delete(API_ENDPOINTS.CATEGORY.DELETE(id));

    return data;
  },
} as const;

/* ----------------------------------
   HOOKS
-----------------------------------*/

const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: categoryAPI.getCategories,
  });
};

const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryAPI.createCategory,

    meta: {
      errorMessage: "Failed to create category",
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
};

const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryAPI.deleteCategory,

    meta: {
      errorMessage: "Failed to delete category",
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
};

/* ----------------------------------
   EXPORT
-----------------------------------*/

export const CATEGORYAPI = {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} as const;
