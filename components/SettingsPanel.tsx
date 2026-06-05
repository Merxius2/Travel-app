"use client";

import { useEffect } from "react";
import { Cloud, Download, Trash2, X } from "lucide-react";
import { GlassCard } from "./GlassCard";

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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-md animate-modal-in rounded-3xl border border-white/25 bg-white/10 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <p className="mt-1 text-sm text-white/60">
              {locationCount} locations · {checkInCount} check-ins
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 transition-all hover:bg-white/20"
          >
            <X className="h-4 w-4 text-white/80" />
          </button>
        </div>

        <div className="space-y-3">
          <GlassCard className="p-4">
            <button
              type="button"
              onClick={onExport}
              className="flex w-full items-center gap-3 text-left transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300/30 bg-emerald-500/20">
                <Download className="h-5 w-5 text-emerald-200" />
              </div>
              <div>
                <p className="font-medium text-white">Data Export</p>
                <p className="text-sm text-white/50">Download your data as JSON</p>
              </div>
            </button>
          </GlassCard>

          <GlassCard className="p-4 opacity-60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-300/30 bg-blue-500/20">
                <Cloud className="h-5 w-5 text-blue-200" />
              </div>
              <div>
                <p className="font-medium text-white">Account Sync</p>
                <p className="text-sm text-white/50">Coming soon — cloud backup</p>
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
                <Trash2 className="h-5 w-5 text-rose-200" />
              </div>
              <div>
                <p className="font-medium text-white">Clear All Data</p>
                <p className="text-sm text-white/50">Remove all locations and visits</p>
              </div>
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}