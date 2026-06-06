"use client";

import { THEME_FAMILIES, type ThemeFamily } from "@/lib/theme";

interface ThemeFamilyPickerProps {
  family: ThemeFamily;
  onChange: (family: ThemeFamily) => void;
}

export function ThemeFamilyPicker({ family, onChange }: ThemeFamilyPickerProps) {
  return (
    <div className="grid gap-2">
      {THEME_FAMILIES.map((option) => {
        const isActive = family === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex w-full items-center gap-3 rounded-[var(--radius-card)] border p-3 text-left transition-all ${
              isActive
                ? "theme-family-active border-glass-strong bg-glass-active shadow-glass"
                : "border-glass bg-glass-subtle hover:border-glass-strong hover:bg-glass"
            }`}
          >
            <div className="flex shrink-0 gap-1">
              {option.preview.map((color) => (
                <span
                  key={color}
                  className="h-8 w-8 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-theme">{option.name}</p>
              <p className="text-xs text-theme-muted">{option.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
