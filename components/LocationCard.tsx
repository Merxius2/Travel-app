"use client";

import { useCallback, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const rippleId = useRef(0);
  const Icon = getIconComponent(location.icon);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const id = rippleId.current++;

      setRipples((prev) => [...prev, { id, x, y }]);
      setIsPressed(true);
      setIsGlowing(true);
      onCheckIn(location.id);

      window.setTimeout(() => setIsPressed(false), 180);
      window.setTimeout(() => setIsGlowing(false), 600);
      window.setTimeout(
        () => setRipples((prev) => prev.filter((ripple) => ripple.id !== id)),
        700
      );
    },
    [location.id, onCheckIn]
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

  return (
    <SwipeReveal
      className="rounded-2xl"
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
        className={`group relative block min-h-[148px] w-full border p-6 text-left backdrop-blur-2xl transition-all duration-300 ${
          isPressed ? "scale-[0.96]" : "hover:scale-[1.02] active:scale-[0.96]"
        }`}
        style={{
          borderColor: `${location.color}55`,
          backgroundColor: `${location.color}18`,
          boxShadow: isGlowing
            ? `0 0 40px ${location.color}55, inset 0 1px 1px rgba(255,255,255,0.25)`
            : `inset 0 1px 1px rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.12)`,
        }}
      >
        {ripples.map((ripple) => (
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
            className="flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110"
            style={{
              borderColor: `${location.color}66`,
              backgroundColor: `${location.color}30`,
              boxShadow: `0 0 20px ${location.color}40`,
            }}
          >
            <Icon className="h-6 w-6" style={{ color: location.color }} />
          </div>

          <div>
            <h3 className="font-semibold" style={{ color: location.color }}>
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
