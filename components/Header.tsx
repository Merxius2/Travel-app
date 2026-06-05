"use client";

import { MapPin, Settings } from "lucide-react";

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-xl">
          <MapPin className="h-5 w-5 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Location Tracker
          </h1>
          <p className="text-sm text-white/60">Track where you go, beautifully</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSettingsClick}
        aria-label="Open settings"
        className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/35 hover:bg-white/20 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)] active:scale-95"
      >
        <Settings className="h-5 w-5 text-white/80 transition-transform duration-300 group-hover:rotate-45 group-hover:text-white" />
      </button>
    </header>
  );
}
