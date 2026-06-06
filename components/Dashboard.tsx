"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { useLocationStore } from "@/hooks/useLocationStore";
import type { Location, LocationFormData } from "@/lib/types";
import { AddLocationCard } from "./AddLocationCard";
import { CreateReportCard } from "./CreateReportCard";
import { GlassCard } from "./GlassCard";
import { Header } from "./Header";
import { LocationCard } from "./LocationCard";
import { LocationModal } from "./LocationModal";
import { ReportView } from "./ReportView";
import { SettingsPanel } from "./SettingsPanel";

type View = "dashboard" | "report";
type ModalMode = "add" | "edit";

export function Dashboard() {
  const {
    locations,
    checkIns,
    hydrated,
    addLocation,
    updateLocation,
    deleteLocation,
    registerCheckIn,
    deleteCheckIn,
    clearAllData,
    exportData,
  } = useLocationStore();

  const [view, setView] = useState<View>("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openAddModal = () => {
    setModalMode("add");
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const openEditModal = (location: Location) => {
    setModalMode("edit");
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleModalSave = (form: LocationFormData) => {
    if (modalMode === "edit" && editingLocation) {
      updateLocation(editingLocation.id, form);
    } else {
      addLocation(form);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2"
          style={{
            borderColor: "var(--spinner-track)",
            borderTopColor: "var(--spinner-head)",
          }}
        />
      </div>
    );
  }

  if (view === "report") {
    return (
      <ReportView
        locations={locations}
        checkIns={checkIns}
        onBack={() => setView("dashboard")}
        onDeleteCheckIn={deleteCheckIn}
      />
    );
  }

  return (
    <>
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />

      <main className="mt-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-theme">Your Locations</h2>
          <p className="text-sm text-theme-muted">
            Tap to check in · swipe left to edit or remove
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onCheckIn={registerCheckIn}
              onEdit={openEditModal}
              onDelete={deleteLocation}
            />
          ))}

          <AddLocationCard onClick={openAddModal} />
          <CreateReportCard
            onClick={() => setView("report")}
            checkInCount={checkIns.length}
          />

          {locations.length === 0 && (
            <GlassCard className="flex min-h-[148px] flex-col items-center justify-center gap-2 p-6 text-center opacity-70">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-glass bg-glass">
                <Settings className="h-5 w-5 text-theme-muted" />
              </div>
              <p className="text-sm font-medium text-theme">Settings</p>
              <p className="text-xs text-theme-subtle">Tap the gear icon above</p>
            </GlassCard>
          )}
        </div>
      </main>

      <LocationModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialLocation={editingLocation}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
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
