
import { jwtDecode } from "jwt-decode";
import { fetchToken } from "./storage";

type DecodedToken = {
  role?: string;
  roles?: string[];
  exp?: number;
};

export const getUserRoleFromToken = () => {
  const token = fetchToken();

  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    return decoded.role || decoded.roles?.[0] || null;
  } catch {
    return null;
  }
};