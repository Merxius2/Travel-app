"use client";

import { useCallback, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { getIconComponent } from "@/lib/icons";
import type { Location } from "@/lib/types";
import { SwipeReveal } from "./SwipeReveal";

interface LocationCardProps {
  location: Location;
  onCheckIn: (locationId: string) => void;
  onEdit: (location: Location) => void;
  onDelete: (locationId: string) => void;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function LocationCard({ location, onCheckIn, onEdit, onDelete }: LocationCardProps) {
  const { family } = useTheme();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const rippleId = useRef(0);
  const Icon = getIconComponent(location.icon);
  const isClay = family === "vibrant-clay";

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const id = rippleId.current++;

      if (!isClay) {
        setRipples((prev) => [...prev, { id, x, y }]);
      }
      setIsPressed(true);
      setIsGlowing(true);
      onCheckIn(location.id);

      window.setTimeout(() => setIsPressed(false), 180);
      window.setTimeout(() => setIsGlowing(false), 600);
      if (!isClay) {
        window.setTimeout(
          () => setRipples((prev) => prev.filter((ripple) => ripple.id !== id)),
          700
        );
      }
    },
    [isClay, location.id, onCheckIn]
  );

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${location.name}"? All visit history for this location will also be removed.`
      )
    ) {
      onDelete(location.id);
    }
  };

  const cardStyle = isClay
    ? ({ "--location-color": location.color } as React.CSSProperties)
    : {
        borderColor: `${location.color}55`,
        backgroundColor: `${location.color}18`,
        boxShadow: isGlowing
          ? `0 0 40px ${location.color}55, inset 0 1px 1px rgba(255,255,255,0.25)`
          : `inset 0 1px 1px rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.12)`,
        border: `1px solid ${location.color}55`,
      };

  return (
    <SwipeReveal
      className="rounded-[var(--radius-card)]"
      opaqueForeground={false}
      actions={[
        {
          id: "edit",
          label: "Edit",
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => onEdit(location),
          className: "action-edit",
        },
        {
          id: "delete",
          label: "Remove",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: handleDelete,
          className: "action-delete",
        },
      ]}
    >
      <button
        type="button"
        onClick={handleClick}
        style={cardStyle}
        className={`location-card-btn group relative block min-h-[148px] w-full rounded-[var(--radius-card)] p-6 text-left transition-all duration-300 ${
          isClay ? "location-card-clay" : ""
        } ${isClay && isGlowing ? "location-card-clay-active" : ""} ${
          isPressed ? "scale-[0.96]" : "hover:scale-[1.02] active:scale-[0.96]"
        }`}
      >
        {!isClay &&
          ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="pointer-events-none absolute animate-ripple rounded-full"
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: `${location.color}40`,
              }}
            />
          ))}

        <div className="relative z-10 flex h-full flex-col justify-between gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center transition-all duration-300 group-hover:scale-110 ${
              isClay
                ? "location-card-icon rounded-2xl"
                : "rounded-xl border"
            }`}
            style={
              isClay
                ? undefined
                : {
                    borderColor: `${location.color}66`,
                    backgroundColor: `${location.color}30`,
                    boxShadow: `0 0 20px ${location.color}40`,
                  }
            }
          >
            <Icon
              className="h-6 w-6"
              style={{ color: isClay ? "#ffffff" : location.color }}
            />
          </div>

          <div>
            <h3
              className={isClay ? "location-card-title font-extrabold" : "font-semibold"}
              style={isClay ? undefined : { color: location.color }}
            >
              {location.name}
            </h3>
            {location.description ? (
              <p className="mt-1 line-clamp-2 text-sm text-theme-muted">{location.description}</p>
            ) : (
              <p className="mt-1 text-sm text-theme-subtle">Tap to check in · swipe for options</p>
            )}
          </div>
        </div>
      </button>
    </SwipeReveal>
  );
}
