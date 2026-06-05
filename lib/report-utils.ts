import type { CheckIn, Location } from "./types";

export interface DayGroup {
  dateKey: string;
  label: string;
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
  return iso.slice(0, 10);
}

function formatDayLabel(dateKey: string): string {
  const today = new Date();
  const todayKey = formatDateKey(today.toISOString());

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday.toISOString());

  if (dateKey === todayKey) {
    return "Today";
  }

  if (dateKey === yesterdayKey) {
    return "Yesterday";
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
      groups.set(dateKey, {
        dateKey,
        label: formatDayLabel(dateKey),
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
