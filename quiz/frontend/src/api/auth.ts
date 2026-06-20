import { useMutation } from "@tanstack/react-query";

import API from "@/request/request";
import { removeUser } from "@/libs/storage";
import { API_ENDPOINTS } from "@/libs/endPoints";
import type { LoginInput, RegisterInput } from "@/libs/validationSchema";
import type {
  LoginResponse,
  RegisterResponse,
  ResendOtpResponse,
  VerifyOtpInput,
  VerifyOtpResponse,
} from "@/types/api";

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

  verifyOtp: async (data: VerifyOtpInput) => {
    const response = await API.post<VerifyOtpResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data,
      {
        requiresAuth: false,
      },
    );

    return response.data;
  },

  resendOtp: async (email: string) => {
    const response = await API.post<ResendOtpResponse>(
      API_ENDPOINTS.AUTH.RESEND_OTP,
      {
        email,
      },
      {
        requiresAuth: false,
      },
    );

    return response.data;
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

const useVerifyOtp = () => {
  return useMutation({
    mutationFn: authAPI.verifyOtp,
  });
};

const useResendOtp = () => {
  return useMutation({
    mutationFn: authAPI.resendOtp,
  });
};

export const USERAUTHAPI = {
  useUserRegister,
  useUserLogin,
  useUserLogout,
  useVerifyOtp,
  useResendOtp,
} as const;
