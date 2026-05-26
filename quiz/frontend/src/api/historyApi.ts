import { useQuery } from "@tanstack/react-query";
import API from "@/request/request";
import API_ENDPOINTS from "@/libs/endPoints";

export const historyKeys = {
  all: ["history"] as const,
  list: () => [...historyKeys.all, "list"] as const,
  detail: (id: string) => [...historyKeys.all, "detail", id] as const,
};

const getHistory = async () => {
  const { data } = await API.get(API_ENDPOINTS.HISTORY.GET_HISTORY);
  return data;
};

const getAuditById = async (id: string) => {
  const { data } = await API.get(`/history/${id}`);
  return data;
};

export const HISTORYAPI = {
  usePlayerHistory: () =>
    useQuery({
      queryKey: historyKeys.list(),
      queryFn: getHistory,
    }),

  useQuizAudit: (id: string) =>
    useQuery({
      queryKey: historyKeys.detail(id),
      queryFn: () => getAuditById(id),
      enabled: !!id,
    }),
};
