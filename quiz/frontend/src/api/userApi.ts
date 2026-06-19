import { useQuery } from "@tanstack/react-query";

import API from "@/request/request";
import { API_ENDPOINTS } from "@/libs/endPoints";

/* ----------------------------------
   QUERY KEYS
-----------------------------------*/
export const userKeys = {
  all: ["users"] as const,
  players: () => [...userKeys.all, "players"] as const,
} as const;

/* ----------------------------------
   API FUNCTIONS
-----------------------------------*/
const userAPI = {
  getPlayers: async () => {
    const { data } = await API.get(API_ENDPOINTS.USER.GET_ALL_PLAYERS);

    return data;
  },
} as const;

/* ----------------------------------
   HOOKS
-----------------------------------*/
const usePlayers = () => {
  return useQuery({
    queryKey: userKeys.players(),
    queryFn: userAPI.getPlayers,
  });
};

/* ----------------------------------
   EXPORT
-----------------------------------*/
export const USERAPI = {
  usePlayers,
} as const;
