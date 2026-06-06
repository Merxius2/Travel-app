import type { CheckIn, Location } from "./types";

export interface DayGroup {
  dateKey: string;
  label: string;
  dateLabel: string;
  entries: {
    checkIn: CheckIn;
    location: Location;
    timeLabel: string;
  }[];
}

export interface LocationStat {
  location: Location;
  count: number;
}

function formatDateKey(iso: string): string {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDatePart(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatFullDatePart(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDayLabel(dateKey: string): { label: string; dateLabel: string } {
  const today = new Date();
  const todayKey = formatDateKey(today.toISOString());

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday.toISOString());

  const date = parseDateKey(dateKey);
  const dateLabel = formatDatePart(date);

  if (dateKey === todayKey) {
    return { label: "Today", dateLabel };
  }

  if (dateKey === yesterdayKey) {
    return { label: "Yesterday", dateLabel };
  }

  return {
    label: formatFullDatePart(date),
    dateLabel: formatFullDatePart(date),
  };
}

function formatTimeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function groupCheckInsByDay(
  checkIns: CheckIn[],
  locations: Location[]
): DayGroup[] {
  const locationMap = new Map(locations.map((location) => [location.id, location]));
  const groups = new Map<string, DayGroup>();

  const sorted = [...checkIns].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  for (const checkIn of sorted) {
    const location = locationMap.get(checkIn.locationId);
    if (!location) {
      continue;
    }

    const dateKey = formatDateKey(checkIn.timestamp);
    const existing = groups.get(dateKey);

    const entry = {
      checkIn,
      location,
      timeLabel: formatTimeLabel(checkIn.timestamp),
    };

    if (existing) {
      existing.entries.push(entry);
    } else {
      const { label, dateLabel } = formatDayLabel(dateKey);
      groups.set(dateKey, {
        dateKey,
        label,
        dateLabel,
        entries: [entry],
      });
    }
  }

  return Array.from(groups.values()).sort((a, b) =>
    b.dateKey.localeCompare(a.dateKey)
  );
}

export function getLocationStats(
  checkIns: CheckIn[],
  locations: Location[]
): LocationStat[] {
  const counts = new Map<string, number>();

  for (const checkIn of checkIns) {
    counts.set(checkIn.locationId, (counts.get(checkIn.locationId) ?? 0) + 1);
  }

  return locations
    .map((location) => ({
      location,
      count: counts.get(location.id) ?? 0,
    }))
    .filter((stat) => stat.count > 0)
    .sort((a, b) => b.count - a.count);
}
