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
        className="absolute inset-0 bg-overlay"
      />

      <div className="glass-modal relative z-10 flex w-full max-w-lg animate-modal-in flex-col overflow-hidden rounded-t-[var(--radius-modal)] sm:max-h-[85vh] sm:rounded-[var(--radius-modal)]">
        <div className="shrink-0 border-b border-glass px-5 pb-4 pt-5 sm:px-8 sm:pt-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-theme">{title}</h2>
              <p className="mt-1 text-sm text-theme-muted">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-glass bg-glass-subtle transition-all hover:bg-glass"
            >
              <X className="h-4 w-4 text-theme-muted" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="max-h-[min(58dvh,calc(85vh-9.5rem))] space-y-5 overflow-y-auto overscroll-contain px-5 py-5 sm:max-h-[calc(85vh-10rem)] sm:px-8">
            <div>
              <label htmlFor="location-name" className="mb-2 block text-sm font-medium text-theme">
                Name
              </label>
              <input
                id="location-name"
                type="text"
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="e.g. Work, Gym, Coffee Shop"
                className="glass-input w-full rounded-xl px-4 py-3 outline-none transition-all focus:border-glass-strong focus:shadow-glass"
              />
            </div>

            <div>
              <label
                htmlFor="location-description"
                className="mb-2 block text-sm font-medium text-theme"
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
                className="glass-input w-full resize-none rounded-xl px-4 py-3 outline-none transition-all focus:border-glass-strong focus:shadow-glass"
              />
            </div>

            <div>
              <span className="mb-3 block text-sm font-medium text-theme">Custom Color</span>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    aria-label={preset.label}
                    onClick={() => setForm((prev) => ({ ...prev, color: preset.value }))}
                    className={`aspect-square rounded-xl border-2 transition-all duration-300 hover:scale-110 ${
                      form.color === preset.value
                        ? "scale-110 border-glass-strong shadow-[0_0_24px_var(--glow)]"
                        : "border-glass hover:border-glass-strong"
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
              <span className="mb-3 block text-sm font-medium text-theme">Icon</span>
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
                          ? "border-glass-strong bg-glass-active shadow-glass"
                          : "border-glass bg-glass-subtle hover:border-glass-strong hover:bg-glass"
                      }`}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: isSelected ? form.color : "var(--theme-text-muted)" }}
                      />
                      <span className="text-[10px] text-theme-subtle">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-glass bg-glass-modal-footer px-5 py-4 sm:px-8">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-clay-secondary flex-1 rounded-xl border border-glass bg-glass-subtle px-4 py-3 text-sm font-medium text-theme-muted transition-all hover:bg-glass"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!form.name.trim()}
                className="btn-clay-primary flex-1 rounded-xl border border-glass-strong bg-glass-active px-4 py-3 text-sm font-semibold text-theme shadow-glass transition-all hover:scale-[1.02] hover:bg-glass disabled:cursor-not-allowed disabled:opacity-40"
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
