"use client";

import { Trash2 } from "lucide-react";
import { getIconComponent } from "@/lib/icons";
import type { CheckIn, Location } from "@/lib/types";
import { SwipeReveal } from "./SwipeReveal";

interface ReportCheckInRowProps {
  checkIn: CheckIn;
  location: Location;
  timeLabel: string;
  onDelete: (checkInId: string) => void;
}

export function ReportCheckInRow({
  checkIn,
  location,
  timeLabel,
  onDelete,
}: ReportCheckInRowProps) {
  const Icon = getIconComponent(location.icon);

  const handleDelete = () => {
    if (window.confirm(`Remove this visit to ${location.name} at ${timeLabel}?`)) {
      onDelete(checkIn.id);
    }
  };

  return (
    <SwipeReveal
      className="rounded-none"
      actions={[
        {
          id: "delete",
          label: "Remove",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: handleDelete,
          className: "action-delete",
        },
      ]}
    >
      <div className="flex items-center gap-4 p-4 transition-colors">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
          style={{
            borderColor: `${location.color}55`,
            backgroundColor: `${location.color}20`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: location.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-theme">{location.name}</p>
          {location.description && (
            <p className="truncate text-sm text-theme-subtle">{location.description}</p>
          )}
        </div>
        <time
          dateTime={checkIn.timestamp}
          className="shrink-0 text-sm font-medium tabular-nums text-theme-muted"
        >
          {timeLabel}
        </time>
      </div>
    </SwipeReveal>
  );
}
