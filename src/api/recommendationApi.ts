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
  getRecommendations: async () => {
    const { data } = await API.get(
      API_ENDPOINTS.RECOMMENDATION.GET_RECOMMENDATIONS,
    );

    return data;
  },
} as const;

/* ----------------------------------
   HOOKS
-----------------------------------*/
const useRecommendations = () => {
  return useQuery({
    queryKey: recommendationKeys.list(),
    queryFn: recommendationAPI.getRecommendations,
  });
};

/* ----------------------------------
   EXPORT
-----------------------------------*/
export const RECOMMENDATIONAPI = {
  useRecommendations,
} as const;
