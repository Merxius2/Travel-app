"use client";

import { BarChart3 } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface CreateReportCardProps {
  onClick: () => void;
  checkInCount: number;
}

export function CreateReportCard({ onClick, checkInCount }: CreateReportCardProps) {
  return (
    <GlassCard
      as="button"
      onClick={onClick}
      className="group min-h-[148px] w-full p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:border-white/35 hover:bg-white/15 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] active:scale-[0.98]"
    >
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/30 bg-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(139,92,246,0.45)]">
          <BarChart3 className="h-6 w-6 text-violet-200" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Create Report</h3>
          <p className="mt-1 text-sm text-white/60">
            {checkInCount > 0
              ? `${checkInCount} visit${checkInCount === 1 ? "" : "s"} tracked`
              : "View your visit history"}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
