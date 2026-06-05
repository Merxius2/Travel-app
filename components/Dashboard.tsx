"use client";

import { useState } from "react";
import { useLocationStore } from "@/hooks/useLocationStore";
import { AddLocationCard } from "./AddLocationCard";
import { AddLocationModal } from "./AddLocationModal";
import { CreateReportCard } from "./CreateReportCard";
import { Header } from "./Header";
import { LocationCard } from "./LocationCard";
import { ReportView } from "./ReportView";
import { SettingsPanel } from "./SettingsPanel";
import { GlassCard } from "./GlassCard";
import { Settings } from "lucide-react";

type View = "dashboard" | "report";

export function Dashboard() {
  const {
    locations,
    checkIns,
    hydrated,
    addLocation,
    registerCheckIn,
    clearAllData,
    exportData,
  } = useLocationStore();

  const [view, setView] = useState<View>("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
      </div>
    );
  }

  if (view === "report") {
    return (
      <ReportView
        locations={locations}
        checkIns={checkIns}
        onBack={() => setView("dashboard")}
      />
    );
  }

  return (
    <>
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />

      <main className="mt-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Your Locations</h2>
          <p className="text-sm text-white/50">
            Tap a location to register a check-in instantly
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onCheckIn={registerCheckIn}
            />
          ))}

          <AddLocationCard onClick={() => setIsAddModalOpen(true)} />
          <CreateReportCard
            onClick={() => setView("report")}
            checkInCount={checkIns.length}
          />

          {locations.length === 0 && (
            <GlassCard className="flex min-h-[148px] flex-col items-center justify-center gap-2 p-6 text-center opacity-70">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10">
                <Settings className="h-5 w-5 text-white/60" />
              </div>
              <p className="text-sm font-medium text-white/70">Settings</p>
              <p className="text-xs text-white/40">Tap the gear icon above</p>
            </GlassCard>
          )}
        </div>
      </main>

      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addLocation}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onExport={exportData}
        onClearAll={clearAllData}
        locationCount={locations.length}
        checkInCount={checkIns.length}
      />
    </>
  );
}
