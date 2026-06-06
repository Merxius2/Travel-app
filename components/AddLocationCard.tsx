"use client";

import { Plus } from "lucide-react";

interface AddLocationCardProps {
  onClick: () => void;
}

export function AddLocationCard({ onClick }: AddLocationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="add-location-card group flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border-2 border-dashed border-glass bg-glass-subtle p-6 transition-all duration-300 hover:scale-[1.02] hover:border-glass-strong hover:bg-glass hover:shadow-glass active:scale-[0.98]"
    >
      <div className="add-location-icon flex h-14 w-14 items-center justify-center rounded-full border border-glass bg-glass shadow-inset-glass transition-all duration-300 group-hover:scale-110 group-hover:border-glass-strong group-hover:bg-glass-active">
        <Plus className="h-7 w-7 text-theme" strokeWidth={2.5} />
      </div>
      <span className="text-sm font-medium text-theme-muted group-hover:text-theme">
        Add Location
      </span>
    </button>
  );
}
