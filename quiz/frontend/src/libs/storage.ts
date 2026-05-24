import Cookies from "js-cookie";
import { storageKey } from "./theme";

/* Token Manager */
const createTokenManager = (key: string) => ({
  save: (token: string) =>
    typeof window !== "undefined" &&
    Cookies.set(key, token, {
      expires: 1,
      sameSite: "Lax",
    }),

  get: () =>
    typeof window !== "undefined" ? (Cookies.get(key) ?? null) : null,

  remove: () => typeof window !== "undefined" && Cookies.remove(key),
});
const user = createTokenManager("ACCESS_TOKEN");

export const { save: saveUser, get: getUser, remove: removeUser } = user;

/* Fetch token for routes */
export const fetchToken = () => {
  return getUser();
};

/* Theme Storage */
const themeStorageManager = (key: string) => ({
  save: (theme: string) =>
    typeof window !== "undefined" && localStorage.setItem(key, theme),

  get: () =>
    typeof window !== "undefined" ? (localStorage.getItem(key) ?? null) : null,

  remove: () => typeof window !== "undefined" && localStorage.removeItem(key),
});

export const themeStorage = themeStorageManager(storageKey);

export const {
  save: saveTheme,
  get: getTheme,
  remove: removeTheme,
} = themeStorage;   