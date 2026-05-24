import { useQuery } from "@tanstack/react-query";
import API from "@/request/request";
import API_ENDPOINTS from "@/libs/endPoints";

export const adminKeys = {
  all: ["admin"] as const,

  dashboard: () => [...adminKeys.all, "dashboard"] as const,
} as const;

const adminAPI = {
  getDashboard: async () => {
    const { data } = await API.get(API_ENDPOINTS.ADMIN.DASHBOARD);

    return data;
  },
} as const;

const useAdminDashboard = () => {
  return useQuery({
    queryKey: adminKeys.dashboard(),

    queryFn: adminAPI.getDashboard,

    meta: {
      errorMessage: "Failed to load admin dashboard",
    },
  });
};

export const ADMINAPI = {
  useAdminDashboard,
} as const;
