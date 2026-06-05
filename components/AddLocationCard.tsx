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
      className="group flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/30 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] active:scale-[0.98]"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:border-white/40 group-hover:bg-white/20">
        <Plus className="h-7 w-7 text-white/90" strokeWidth={2.5} />
      </div>
      <span className="text-sm font-medium text-white/80 group-hover:text-white">
        Add Location
      </span>
    </button>
  );
}
