import { useQuery } from "@tanstack/react-query";

import API from "@/request/request";
import { API_ENDPOINTS } from "@/libs/endPoints";

/* ----------------------------------
   QUERY KEYS
-----------------------------------*/
export const leaderboardKeys = {
  all: ["leaderboard"] as const,
  list: () => [...leaderboardKeys.all, "list"] as const,
} as const;

/* ----------------------------------
   API FUNCTIONS
-----------------------------------*/
const leaderboardAPI = {
  getLeaderboard: async () => {
    const { data } = await API.get(API_ENDPOINTS.LEADERBOARD.GET_LEADERBOARD);

    return data;
  },
} as const;

/* ----------------------------------
   HOOKS
-----------------------------------*/
const useLeaderboard = () => {
  return useQuery({
    queryKey: leaderboardKeys.list(),
    queryFn: leaderboardAPI.getLeaderboard,
  });
};

/* ----------------------------------
   EXPORT
-----------------------------------*/
export const LEADERBOARDAPI = {
  useLeaderboard,
} as const;
