"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { COLOR_PRESETS, ICON_OPTIONS } from "@/lib/icons";
import type { Location, LocationFormData, LocationIconId } from "@/lib/types";

interface LocationModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialLocation?: Location | null;
  onClose: () => void;
  onSave: (data: LocationFormData) => void;
}

const defaultForm: LocationFormData = {
  name: "",
  description: "",
  color: COLOR_PRESETS[0].value,
  icon: "home",
};

function locationToForm(location: Location): LocationFormData {
  return {
    name: location.name,
    description: location.description,
    color: location.color,
    icon: location.icon,
  };
}

export function LocationModal({
  isOpen,
  mode,
  initialLocation,
  onClose,
  onSave,
}: LocationModalProps) {
  const [form, setForm] = useState<LocationFormData>(defaultForm);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && initialLocation) {
      setForm(locationToForm(initialLocation));
    } else {
      setForm(defaultForm);
    }
  }, [isOpen, mode, initialLocation]);

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      return;
    }
    onSave(form);
    onClose();
  };

  const title = mode === "edit" ? "Edit Location" : "Add Location";
  const subtitle =
    mode === "edit"
      ? "Update this location's details"
      : "Create a quick-check button for a place you visit";
  const submitLabel = mode === "edit" ? "Save Changes" : "Save Location";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative z-10 flex max-h-[92dvh] w-full max-w-lg animate-modal-in flex-col overflow-hidden rounded-t-3xl border border-white/25 bg-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-2xl sm:max-h-[85vh] sm:rounded-3xl">
        <div className="shrink-0 border-b border-white/10 px-5 pb-4 pt-5 sm:px-8 sm:pt-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="mt-1 text-sm text-white/60">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 transition-all hover:bg-white/20"
            >
              <X className="h-4 w-4 text-white/80" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8">
            <div>
              <label htmlFor="location-name" className="mb-2 block text-sm font-medium text-white/80">
                Name
              </label>
              <input
                id="location-name"
                type="text"
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="e.g. Work, Gym, Coffee Shop"
                className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 outline-none transition-all focus:border-white/40 focus:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
              />
            </div>

            <div>
              <label
                htmlFor="location-description"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                Description
              </label>
              <textarea
                id="location-description"
                rows={2}
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="Optional notes about this location"
                className="w-full resize-none rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 outline-none transition-all focus:border-white/40 focus:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
              />
            </div>

            <div>
              <span className="mb-3 block text-sm font-medium text-white/80">Custom Color</span>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    aria-label={preset.label}
                    onClick={() => setForm((prev) => ({ ...prev, color: preset.value }))}
                    className={`aspect-square rounded-xl border-2 transition-all duration-300 hover:scale-110 ${
                      form.color === preset.value
                        ? "scale-110 border-white shadow-[0_0_24px_var(--glow)]"
                        : "border-white/20 hover:border-white/50"
                    }`}
                    style={
                      {
                        backgroundColor: preset.value,
                        "--glow": `${preset.value}88`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="mb-3 block text-sm font-medium text-white/80">Icon</span>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {ICON_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = form.icon === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-label={option.label}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, icon: option.id as LocationIconId }))
                      }
                      className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 transition-all duration-300 hover:scale-105 sm:p-3 ${
                        isSelected
                          ? "border-white/50 bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                          : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: isSelected ? form.color : "rgba(255,255,255,0.7)" }}
                      />
                      <span className="text-[10px] text-white/50">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-black/20 px-5 py-4 backdrop-blur-xl sm:px-8">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition-all hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!form.name.trim()}
                className="flex-1 rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
