import { useQuery } from "@tanstack/react-query";

import API from "@/request/request";
import { API_ENDPOINTS } from "@/libs/endPoints";

/* ----------------------------------
   QUERY KEYS
-----------------------------------*/
export const recommendationKeys = {
  all: ["recommendations"] as const,
  list: () => [...recommendationKeys.all, "list"] as const,
} as const;

/* ----------------------------------
   API FUNCTIONS
-----------------------------------*/
const recommendationAPI = {
  getRecommendations: async (type: string) => {
    const { data } = await API.get(
      `${API_ENDPOINTS.RECOMMENDATION.GET_RECOMMENDATIONS}?type=${type}`,
    );

    return data;
  },
} as const;

/* ----------------------------------
   HOOKS
-----------------------------------*/
const useRecommendations = (type: string) => {
  return useQuery({
    queryKey: [...recommendationKeys.list(), type],
    queryFn: () => recommendationAPI.getRecommendations(type),
  });
};

/* ----------------------------------
   EXPORT
-----------------------------------*/
export const RECOMMENDATIONAPI = {
  useRecommendations,
} as const;
