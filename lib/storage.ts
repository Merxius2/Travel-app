import type { AppState } from "./types";

const STORAGE_KEY = "location-tracker-state";

export const defaultState: AppState = {
  locations: [],
  checkIns: [],
};

export function loadState(): AppState {
  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw) as AppState;
    return {
      locations: Array.isArray(parsed.locations) ? parsed.locations : [],
      checkIns: Array.isArray(parsed.checkIns) ? parsed.checkIns : [],
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}
