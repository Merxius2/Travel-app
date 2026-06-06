"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyThemeSettings,
  getStoredThemeSettings,
  resolveColorMode,
  saveThemeSettings,
  type ColorPreference,
  type ResolvedColorMode,
  type ThemeFamily,
  type ThemeSettings,
} from "@/lib/theme";

export function useTheme() {
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

  const updateSettings = useCallback((next: ThemeSettings) => {
    saveThemeSettings(next);
    setSettings(next);
    setResolvedMode(applyThemeSettings(next));
  }, []);

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

  return {
    family: settings.family,
    colorPreference: settings.colorPreference,
    resolvedMode,
    setFamily,
    setColorPreference,
    /** @deprecated Use colorPreference */
    preference: settings.colorPreference,
    /** @deprecated Use setColorPreference */
    setPreference: setColorPreference,
    /** @deprecated Use resolvedMode */
    resolved: resolvedMode,
    isDark: resolvedMode === "dark",
    isLight: resolvedMode === "light",
    isSystem: settings.colorPreference === "system",
  };
}
