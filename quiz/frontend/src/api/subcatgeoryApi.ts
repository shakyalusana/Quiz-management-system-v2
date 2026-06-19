import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import API from "@/request/request";
import { API_ENDPOINTS } from "@/libs/endPoints";

export const subCategoryKeys = {
  all: ["subcategories"] as const,

  list: () => [...subCategoryKeys.all, "list"] as const,

  listByCategory: (categoryId: string) =>
    [...subCategoryKeys.all, "category", categoryId] as const,

  create: () => [...subCategoryKeys.all, "create"] as const,

  update: () => [...subCategoryKeys.all, "update"] as const,

  delete: () => [...subCategoryKeys.all, "delete"] as const,
} as const;

const subCategoryAPI = {
  // Get all subcategories
  getSubCategories: async (categoryId?: string) => {
    const { data } = await API.get(API_ENDPOINTS.SUBCATEGORY.GET_ALL, {
      params: categoryId ? { categoryId } : {},
    });

    return data;
  },

  // Create subcategory
  createSubCategory: async (payload: { name: string; category: string }) => {
    const { data } = await API.post(API_ENDPOINTS.SUBCATEGORY.CREATE, payload);

    return data;
  },

  // Update subcategory
  updateSubCategory: async ({
    id,
    payload,
  }: {
    id: string;
    payload: {
      name?: string;
      category?: string;
    };
  }) => {
    const { data } = await API.put(
      API_ENDPOINTS.SUBCATEGORY.UPDATE(id),
      payload,
    );

    return data;
  },

  // Delete subcategory
  deleteSubCategory: async (id: string) => {
    const { data } = await API.delete(API_ENDPOINTS.SUBCATEGORY.DELETE(id));

    return data;
  },
} as const;

/* ----------------------------------
   HOOKS
-----------------------------------*/

// Get all subcategories
const useSubCategories = (categoryId?: string) => {
  return useQuery({
    queryKey: categoryId
      ? subCategoryKeys.listByCategory(categoryId)
      : subCategoryKeys.list(),

    queryFn: () => subCategoryAPI.getSubCategories(categoryId),
  });
};

// Create subcategory
const useCreateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subCategoryAPI.createSubCategory,

    meta: {
      errorMessage: "Failed to create subcategory",
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subCategoryKeys.all,
      });
    },
  });
};

// Update subcategory
const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subCategoryAPI.updateSubCategory,

    meta: {
      errorMessage: "Failed to update subcategory",
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subCategoryKeys.all,
      });
    },
  });
};

// Delete subcategory
const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subCategoryAPI.deleteSubCategory,

    meta: {
      errorMessage: "Failed to delete subcategory",
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subCategoryKeys.all,
      });
    },
  });
};

/* ----------------------------------
   EXPORT
-----------------------------------*/

export const SUBCATEGORYAPI = {
  useSubCategories,

  useCreateSubCategory,

  useUpdateSubCategory,

  useDeleteSubCategory,
} as const;
