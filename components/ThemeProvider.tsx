"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyThemeSettings,
  getStoredThemeSettings,
  saveThemeSettings,
  type ColorPreference,
  type ResolvedColorMode,
  type ThemeFamily,
  type ThemeSettings,
} from "@/lib/theme";

interface ThemeContextValue {
  family: ThemeFamily;
  colorPreference: ColorPreference;
  resolvedMode: ResolvedColorMode;
  setFamily: (family: ThemeFamily) => void;
  setColorPreference: (colorPreference: ColorPreference) => void;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>({
    family: "liquid-glass",
    colorPreference: "system",
  });
  const [resolvedMode, setResolvedMode] = useState<ResolvedColorMode>("dark");

  useEffect(() => {
    const stored = getStoredThemeSettings();
    setSettings(stored);
    setResolvedMode(applyThemeSettings(stored));
  }, []);

  useEffect(() => {
    if (settings.colorPreference !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setResolvedMode(applyThemeSettings(settings));
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [settings]);

  const setFamily = useCallback((family: ThemeFamily) => {
    setSettings((prev) => {
      const next = { ...prev, family };
      saveThemeSettings(next);
      setResolvedMode(applyThemeSettings(next));
      return next;
    });
  }, []);

  const setColorPreference = useCallback((colorPreference: ColorPreference) => {
    setSettings((prev) => {
      const next = { ...prev, colorPreference };
      saveThemeSettings(next);
      setResolvedMode(applyThemeSettings(next));
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      family: settings.family,
      colorPreference: settings.colorPreference,
      resolvedMode,
      setFamily,
      setColorPreference,
      isDark: resolvedMode === "dark",
      isLight: resolvedMode === "light",
      isSystem: settings.colorPreference === "system",
    }),
    [settings, resolvedMode, setFamily, setColorPreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
