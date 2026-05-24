import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponse } from "@/types/api";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  hasHydrated: boolean;
  isVerified: boolean;

  setUser: (apiUser: UserResponse) => void;
  resetAuth: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      hasHydrated: false,
      isVerified: false,

      setUser: (apiUser) =>
        set({
          user: {
            id: apiUser.data.id,
            userName: apiUser.data.userName,
            email: apiUser.data.email,
            roles: apiUser.data.roles,
            scopes: apiUser.data.scopes,
          },
          isVerified: true,
          isLoading: false,
        }),

      resetAuth: () =>
        set({
          user: null,
          isVerified: false,
          isLoading: false,
        }),

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
