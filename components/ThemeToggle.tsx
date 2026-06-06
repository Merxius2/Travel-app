"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import type { ThemePreference } from "@/lib/theme";

interface ThemeToggleProps {
  preference: ThemePreference;
  onChange: (preference: ThemePreference) => void;
}

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export function ThemeToggle({ preference, onChange }: ThemeToggleProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = preference === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-all ${
              isActive
                ? "border-glass-strong bg-glass-active text-theme shadow-glass"
                : "border-glass bg-glass-subtle text-theme-muted hover:border-glass-strong hover:bg-glass"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
