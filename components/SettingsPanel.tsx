"use client";

import { useEffect } from "react";
import { Cloud, Download, Palette, Trash2, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { GlassCard } from "./GlassCard";
import { ThemeFamilyPicker } from "./ThemeFamilyPicker";
import { ThemeToggle } from "./ThemeToggle";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onClearAll: () => void;
  locationCount: number;
  checkInCount: number;
}

export function SettingsPanel({
  isOpen,
  onClose,
  onExport,
  onClearAll,
  locationCount,
  checkInCount,
}: SettingsPanelProps) {
  const { family, colorPreference, setFamily, setColorPreference } = useTheme();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleClearAll = () => {
    if (
      window.confirm(
        "Clear all locations and check-ins? This cannot be undone."
      )
    ) {
      onClearAll();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 bg-overlay"
      />

      <div className="glass-modal relative z-10 max-h-[92dvh] w-full max-w-md animate-modal-in overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-theme">Settings</h2>
            <p className="mt-1 text-sm text-theme-muted">
              {locationCount} locations · {checkInCount} check-ins
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-glass bg-glass-subtle transition-all hover:bg-glass"
          >
            <X className="h-4 w-4 text-theme-muted" />
          </button>
        </div>

        <div className="space-y-3">
          <GlassCard className="p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] border border-glass bg-glass-active">
                <Palette className="h-5 w-5 text-theme-muted" />
              </div>
              <div>
                <p className="font-medium text-theme">Appearance</p>
                <p className="text-sm text-theme-muted">Theme & color mode</p>
              </div>
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-theme-subtle">
              Theme
            </p>
            <ThemeFamilyPicker family={family} onChange={setFamily} />

            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-theme-subtle">
              Color mode
            </p>
            <ThemeToggle preference={colorPreference} onChange={setColorPreference} />
          </GlassCard>

          <GlassCard className="p-4">
            <button
              type="button"
              onClick={onExport}
              className="flex w-full items-center gap-3 text-left transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300/30 bg-emerald-500/20">
                <Download className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-medium text-theme">Data Export</p>
                <p className="text-sm text-theme-muted">Download your data as JSON</p>
              </div>
            </button>
          </GlassCard>

          <GlassCard className="p-4 opacity-60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-300/30 bg-blue-500/20">
                <Cloud className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-theme">Account Sync</p>
                <p className="text-sm text-theme-muted">Coming soon — cloud backup</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <button
              type="button"
              onClick={handleClearAll}
              className="flex w-full items-center gap-3 text-left transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-300/30 bg-rose-500/20">
                <Trash2 className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <p className="font-medium text-theme">Clear All Data</p>
                <p className="text-sm text-theme-muted">Remove all locations and visits</p>
              </div>
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
