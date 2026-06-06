"use client";

import { ArrowLeft } from "lucide-react";
import { getIconComponent } from "@/lib/icons";
import { getLocationStats, groupCheckInsByDay } from "@/lib/report-utils";
import type { CheckIn, Location } from "@/lib/types";
import { GlassCard } from "./GlassCard";
import { ReportCheckInRow } from "./ReportCheckInRow";

interface ReportViewProps {
  locations: Location[];
  checkIns: CheckIn[];
  onBack: () => void;
  onDeleteCheckIn: (checkInId: string) => void;
}

export function ReportView({
  locations,
  checkIns,
  onBack,
  onDeleteCheckIn,
}: ReportViewProps) {
  const dayGroups = groupCheckInsByDay(checkIns, locations);
  const stats = getLocationStats(checkIns, locations);
  const totalVisits = checkIns.length;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/35 hover:bg-white/20 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 text-white/80" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-white">Visit Report</h2>
          <p className="text-sm text-white/60">
            {totalVisits > 0
              ? `${totalVisits} total visit${totalVisits === 1 ? "" : "s"} across ${stats.length} location${stats.length === 1 ? "" : "s"}`
              : "No visits recorded yet"}
          </p>
        </div>
      </div>

      {totalVisits === 0 ? (
        <GlassCard className="p-10 text-center">
          <p className="text-lg font-medium text-white/80">No check-ins yet</p>
          <p className="mt-2 text-sm text-white/50">
            Tap a location on the dashboard to start tracking your visits.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-8">
          {stats.length > 0 && (
            <section>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
                Visit Statistics
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map(({ location, count }) => {
                  const Icon = getIconComponent(location.icon);
                  return (
                    <GlassCard key={location.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg border"
                          style={{
                            borderColor: `${location.color}55`,
                            backgroundColor: `${location.color}25`,
                          }}
                        >
                          <Icon className="h-5 w-5" style={{ color: location.color }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-white">{location.name}</p>
                          <p className="text-sm text-white/50">
                            {count} visit{count === 1 ? "" : "s"}
                          </p>
                        </div>
                        <span
                          className="text-2xl font-bold tabular-nums"
                          style={{ color: location.color }}
                        >
                          {count}
                        </span>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
              Timeline
            </h3>
            <p className="mb-3 text-xs text-white/40">Swipe left on an entry to remove it</p>
            <div className="space-y-6">
              {dayGroups.map((group) => (
                <div key={group.dateKey}>
                  <h4 className="mb-3 text-lg font-semibold text-white">{group.label}</h4>
                  <GlassCard className="divide-y divide-white/10 overflow-hidden p-0">
                    {group.entries.map(({ checkIn, location, timeLabel }) => (
                      <ReportCheckInRow
                        key={checkIn.id}
                        checkIn={checkIn}
                        location={location}
                        timeLabel={timeLabel}
                        onDelete={onDeleteCheckIn}
                      />
                    ))}
                  </GlassCard>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
