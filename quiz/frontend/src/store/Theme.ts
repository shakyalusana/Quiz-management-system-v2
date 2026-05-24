import { getTheme, saveTheme } from "@/libs/storage";
import { create } from "zustand";

type Theme = "dark" | "light" | "system";

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyTheme: (theme?: Theme) => void;
};

function getStoredTheme(): Theme {
  return (getTheme() as Theme) || "system";
}

function applyThemeToDocument(theme: Theme) {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

export const useThemeStore = create<ThemeState>((set) => {
  const initialTheme = getStoredTheme();
  if (typeof window !== "undefined") {
    applyThemeToDocument(initialTheme);
  }

  return {
    theme: initialTheme,
    setTheme: (theme: Theme) => {
      saveTheme(theme);
      applyThemeToDocument(theme);
      set({ theme });
    },
    applyTheme: (theme?: Theme) => {
      const current = theme || getStoredTheme();
      applyThemeToDocument(current);
      set({ theme: current });
    },
  };
});
