"use client";

import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "div" | "button";
  style?: React.CSSProperties;
}

export function GlassCard({
  children,
  className = "",
  onClick,
  as = "div",
  style,
}: GlassCardProps) {
  const baseClass =
    "rounded-2xl border border-white/20 bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition-all duration-300";

  if (as === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        style={style}
        className={`${baseClass} text-left ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div onClick={onClick} style={style} className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
}
