
import { useNavigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
// import { useAuthStore } from "@/store/authStore/authStore";
import { fetchToken } from "@/libs/storage";
import MainLoader from "@/components/MainLoader";
import { getUserRoleFromToken } from "@/libs/useUserStorage";

const PublicRoute = () => {
  const navigate = useNavigate();

  const { data: token, isLoading: tokenLoading } = useQuery({
    queryKey: ["authToken"],
    queryFn: fetchToken,
    staleTime: Infinity,
  });

  // const { user, isLoading: userLoading, hasHydrated } = useAuthStore();

  const role = getUserRoleFromToken();

  // const isCheckingAuth = tokenLoading || !hasHydrated || userLoading;
  const isCheckingAuth = tokenLoading;

  const isAdministrator = useMemo(() => {
    return role?.includes("superadmin") ?? false;
  }, [role]);

  useEffect(() => {
    if (!isCheckingAuth && token && role) {
      navigate(isAdministrator ? "/admin" : "/dashboard", {
        replace: true,
      });
    }
  }, [isCheckingAuth, token, isAdministrator, navigate, role]);

  if (isCheckingAuth) {
    return <MainLoader />;
  }

  return <Outlet />;
};

export default PublicRoute;