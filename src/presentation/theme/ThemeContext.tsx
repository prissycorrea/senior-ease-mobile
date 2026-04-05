import {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";

import type { ThemePreference } from "../../domain/entities/ThemePreference";
import {
  createThemePalette,
  type ThemePalette,
} from "./themePalette";

interface ThemeContextValue {
  preference: ThemePreference;
  palette: ThemePalette;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  preference,
  children,
}: PropsWithChildren<{ preference: ThemePreference }>) {
  const value: ThemeContextValue = {
    preference,
    palette: createThemePalette(preference),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme deve ser usado dentro de ThemeProvider");
  }
  return ctx;
}
