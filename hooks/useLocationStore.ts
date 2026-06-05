"use client";

import { useCallback, useEffect, useState } from "react";
import { clearState, loadState, saveState } from "@/lib/storage";
import type { AppState, Location, LocationFormData } from "@/lib/types";

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useLocationStore() {
  const [state, setState] = useState<AppState>({ locations: [], checkIns: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    saveState(state);
  }, [state, hydrated]);

  const addLocation = useCallback((form: LocationFormData) => {
    const location: Location = {
      id: createId(),
      name: form.name.trim(),
      description: form.description.trim(),
      color: form.color,
      icon: form.icon,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      locations: [...prev.locations, location],
    }));

    return location;
  }, []);

  const registerCheckIn = useCallback((locationId: string) => {
    const checkIn = {
      id: createId(),
      locationId,
      timestamp: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      checkIns: [checkIn, ...prev.checkIns],
    }));

    return checkIn;
  }, []);

  const clearAllData = useCallback(() => {
    clearState();
    setState({ locations: [], checkIns: [] });
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `location-tracker-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [state]);

  return {
    ...state,
    hydrated,
    addLocation,
    registerCheckIn,
    clearAllData,
    exportData,
  };
}
