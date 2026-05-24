import { useQuery } from "@tanstack/react-query";

import API from "@/request/request";
import API_ENDPOINTS from "@/libs/endPoints";

export const historyKeys = {
  all: ["history"] as const,

  history: () => [...historyKeys.all, "history"] as const,
} as const;

const historyAPI = {
  getHistory: async () => {
    const { data } = await API.get(API_ENDPOINTS.HISTORY.GET_HISTORY);
    return data;
  },
} as const;

const usePlayerHistory = () => {
  return useQuery({
    queryKey: historyKeys.history(),
    queryFn: historyAPI.getHistory,
    meta: {
      errorMessage: "Failed to fetch player history",
    },
  });
};

export const HISTORYAPI = {
  usePlayerHistory,
} as const;
