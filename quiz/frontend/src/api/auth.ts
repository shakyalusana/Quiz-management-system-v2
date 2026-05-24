import { useMutation } from "@tanstack/react-query";

import API from "@/request/request";
import { removeUser } from "@/libs/storage";
import { API_ENDPOINTS } from "@/libs/endPoints";
import type { LoginInput, RegisterInput } from "@/libs/validationSchema";
import type { LoginResponse, RegisterResponse } from "@/types/api";

const userKeys = {
  all: ["user"] as const,
  login: () => [...userKeys.all, "login"] as const,
  register: () => [...userKeys.all, "register"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  logout: () => [...userKeys.all, "logout"] as const,
} as const;

const authAPI = {
  register: async (credentials: RegisterInput) => {
    const { data } = await API.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials,
      { requiresAuth: false },
    );
    return data;
  },
  login: async (credentials: LoginInput) => {
    const { data } = await API.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      { requiresAuth: false },
    );
    return data;
  },
  logout: async () => {
    removeUser();
    return;
  },
} as const;

const useUserRegister = () => {
  return useMutation({
    mutationFn: authAPI.register,
    meta: { errorMessage: "Registration failed" },
  });
};

const useUserLogin = () => {
  return useMutation({
    mutationFn: authAPI.login,
    meta: { errorMessage: "Login failed" },
  });
};

const useUserLogout = () => {
  return useMutation({
    mutationFn: authAPI.logout,
    meta: { errorMessage: "Logout failed" },
  });
};

export const USERAUTHAPI = {
  useUserRegister,
  useUserLogin,
  useUserLogout,
} as const;
