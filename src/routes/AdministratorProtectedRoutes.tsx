
import { useNavigate, Outlet } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { fetchToken } from "@/libs/storage";
import { getUserRoleFromToken } from "@/libs/useUserStorage";
import MainLoader from "@/components/MainLoader";


const AdministratorProtectedRoute = () => {
  const navigate = useNavigate();

  const token = fetchToken();
  const role = getUserRoleFromToken();

  const isCheckingAuth = !role;

  const isAuthorized = useMemo(() => {
    if (!token || !role) return false;

    // allow only SuperAdmin or User
    if (role === "superadmin" || role === "User") {
      return true;
    }

    return false;
  }, [token, role]);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthorized) {
      navigate("/", { replace: true });
    }
  }, [isCheckingAuth, isAuthorized, navigate]);

  if (isCheckingAuth) {
    return <MainLoader />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <Outlet />;
};

export default AdministratorProtectedRoute;