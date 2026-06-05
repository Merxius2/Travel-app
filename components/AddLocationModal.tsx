"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { COLOR_PRESETS, ICON_OPTIONS } from "@/lib/icons";
import type { LocationFormData, LocationIconId } from "@/lib/types";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LocationFormData) => void;
}

const defaultForm: LocationFormData = {
  name: "",
  description: "",
  color: COLOR_PRESETS[0].value,
  icon: "home",
};

export function AddLocationModal({ isOpen, onClose, onSave }: AddLocationModalProps) {
  const [form, setForm] = useState<LocationFormData>(defaultForm);

  useEffect(() => {
    if (isOpen) {
      setForm(defaultForm);
    }
  }, [isOpen]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg animate-modal-in rounded-3xl border border-white/25 bg-white/10 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Add Location</h2>
            <p className="mt-1 text-sm text-white/60">
              Create a quick-check button for a place you visit
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

        <form onSubmit={handleSubmit} className="space-y-5">
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
                    className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-all duration-300 hover:scale-105 ${
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

          <div className="flex gap-3 pt-2">
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
              Save Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
