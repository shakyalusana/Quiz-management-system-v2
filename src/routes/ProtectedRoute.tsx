
import { useNavigate, Outlet } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { fetchToken } from "@/libs/storage";
import { getUserRoleFromToken } from "@/libs/useUserStorage";
import MainLoader from "@/components/MainLoader";

const ProtectedRoute = () => {
  const navigate = useNavigate();

  const token = fetchToken();
  const role = getUserRoleFromToken();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isAuthorized = useMemo(() => {
    if (!token) return false;

    if (typeof role === "string") {
      return role === "user";
    }

    return false;
  }, [token, role]);

  useEffect(() => {
    if (!loading && !isAuthorized) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthorized, navigate]);

  if (loading) {
    return <MainLoader />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;