"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  getStoredThemePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    const stored = getStoredThemePreference();
    setPreferenceState(stored);
    setResolved(applyTheme(stored));
  }, []);

  useEffect(() => {
    if (preference !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setResolved(applyTheme("system"));
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setPreferenceState(next);
    setResolved(applyTheme(next));
  }, []);

  return {
    preference,
    resolved,
    setPreference,
    isDark: resolved === "dark",
    isLight: resolved === "light",
    isSystem: preference === "system",
  };
}
