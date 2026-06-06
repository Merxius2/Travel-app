"use client";

import { MapPin, Settings } from "lucide-react";

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-glass bg-glass-active shadow-inset-glass backdrop-blur-xl">
          <MapPin className="h-5 w-5 text-theme" strokeWidth={2.2} />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-theme sm:text-2xl">
            Location Tracker
          </h1>
          <p className="text-sm text-theme-muted">Track where you go, beautifully</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSettingsClick}
        aria-label="Open settings"
        className="group flex h-11 w-11 items-center justify-center rounded-xl border border-glass bg-glass backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-glass-strong hover:bg-glass-active hover:shadow-glass active:scale-95"
      >
        <Settings className="h-5 w-5 text-theme-muted transition-transform duration-300 group-hover:rotate-45 group-hover:text-theme" />
      </button>
    </header>
  );
}
