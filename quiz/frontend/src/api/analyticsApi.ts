import { useQuery } from "@tanstack/react-query";
import API from "@/request/request";

const getUserStats = async () => {
  const { data } = await API.get("/analytics/stats");
  return data;
};

const useUserStats = () => {
  return useQuery({
    queryKey: ["user-stats"],
    queryFn: getUserStats,
  });
};

export const ANALYTICSAPI = {
  useUserStats,
};
