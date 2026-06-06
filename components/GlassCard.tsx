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
  const baseClass = "glass-card transition-all duration-300";

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
