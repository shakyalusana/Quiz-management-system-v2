import { create } from "zustand";

export interface ScopeAuthorization {
  scope: string;
  isAuthorized: boolean;
}

interface RoleScopeState {
  scopeAuthorizationStatus: ScopeAuthorization[];
  scopeMap: Map<string, boolean>;
  isHydrated: boolean;
  setRoleScopeData: (scopes: ScopeAuthorization[]) => void;
  hasScope: (scope: string) => boolean;
  reset: () => void;
}

export const useRoleScopeStore = create<RoleScopeState>((set, get) => ({
  scopeAuthorizationStatus: [],
  scopeMap: new Map(),
  isHydrated: false,

  setRoleScopeData: (scopes) => {
    const map = new Map<string, boolean>();

    for (const { scope, isAuthorized } of scopes) {
      map.set(scope, isAuthorized);
    }

    set({
      scopeAuthorizationStatus: scopes,
      scopeMap: map,
      isHydrated: true,
    });
  },

  hasScope: (scope) => {
    return get().scopeMap.get(scope) ?? false;
  },

  reset: () =>
    set({
      scopeAuthorizationStatus: [],
      scopeMap: new Map(),
      isHydrated: false,
    }),
}));
