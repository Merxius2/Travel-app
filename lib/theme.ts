export type ThemeFamily = "liquid-glass" | "vibrant-clay";
export type ColorPreference = "system" | "light" | "dark";
export type ResolvedColorMode = "light" | "dark";

/** @deprecated Use ColorPreference */
export type ThemePreference = ColorPreference;
/** @deprecated Use ResolvedColorMode */
export type ResolvedTheme = ResolvedColorMode;

export const THEME_FAMILY_KEY = "location-tracker-theme-family";
export const COLOR_PREFERENCE_KEY = "location-tracker-color-preference";
/** @deprecated Legacy key — migrated on read */
export const THEME_STORAGE_KEY = "location-tracker-theme";

export interface ThemeFamilyOption {
  id: ThemeFamily;
  name: string;
  description: string;
  preview: [string, string];
}

export const THEME_FAMILIES: ThemeFamilyOption[] = [
  {
    id: "liquid-glass",
    name: "Liquid Glass",
    description: "Fluid glassmorphism with vibrant gradients",
    preview: ["#8B5CF6", "#06B6D4"],
  },
  {
    id: "vibrant-clay",
    name: "Vibrant Clay",
    description: "Playful clay style with lime & purple accents",
    preview: ["#D4FF5B", "#7B61FF"],
  },
];

export interface ThemeSettings {
  family: ThemeFamily;
  colorPreference: ColorPreference;
}

export function isThemeFamily(value: string): value is ThemeFamily {
  return value === "liquid-glass" || value === "vibrant-clay";
}

export function isColorPreference(value: string): value is ColorPreference {
  return value === "system" || value === "light" || value === "dark";
}

function migrateLegacyColorPreference(): ColorPreference | null {
  if (typeof window === "undefined") {
    return null;
  }

  const legacy = localStorage.getItem(THEME_STORAGE_KEY);
  if (legacy && isColorPreference(legacy)) {
    localStorage.setItem(COLOR_PREFERENCE_KEY, legacy);
    localStorage.removeItem(THEME_STORAGE_KEY);
    return legacy;
  }

  return null;
}

export function getStoredThemeSettings(): ThemeSettings {
  if (typeof window === "undefined") {
    return { family: "liquid-glass", colorPreference: "system" };
  }

  const migrated = migrateLegacyColorPreference();
  const storedFamily = localStorage.getItem(THEME_FAMILY_KEY);
  const storedPreference =
    migrated ?? localStorage.getItem(COLOR_PREFERENCE_KEY) ?? "system";

  return {
    family: storedFamily && isThemeFamily(storedFamily) ? storedFamily : "liquid-glass",
    colorPreference: isColorPreference(storedPreference) ? storedPreference : "system",
  };
}

export function resolveColorMode(preference: ColorPreference): ResolvedColorMode {
  if (preference === "light" || preference === "dark") {
    return preference;
  }

  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyThemeSettings(settings: ThemeSettings): ResolvedColorMode {
  const mode = resolveColorMode(settings.colorPreference);

  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme-family", settings.family);
    document.documentElement.setAttribute("data-theme-mode", mode);
    document.documentElement.setAttribute("data-color-preference", settings.colorPreference);
    document.documentElement.style.colorScheme = mode;
  }

  return mode;
}

export function saveThemeSettings(settings: ThemeSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(THEME_FAMILY_KEY, settings.family);
  localStorage.setItem(COLOR_PREFERENCE_KEY, settings.colorPreference);
}

export const themeInitScript = `
(function () {
  try {
    var familyStored = localStorage.getItem("${THEME_FAMILY_KEY}");
    var family = familyStored === "liquid-glass" || familyStored === "vibrant-clay" ? familyStored : "liquid-glass";
    var prefStored = localStorage.getItem("${COLOR_PREFERENCE_KEY}") || localStorage.getItem("${THEME_STORAGE_KEY}");
    var preference = prefStored === "light" || prefStored === "dark" || prefStored === "system" ? prefStored : "system";
    var mode = preference === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : preference;
    document.documentElement.setAttribute("data-theme-family", family);
    document.documentElement.setAttribute("data-theme-mode", mode);
    document.documentElement.setAttribute("data-color-preference", preference);
    document.documentElement.style.colorScheme = mode;
  } catch (e) {}
})();
`;
