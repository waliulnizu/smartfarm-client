"use client";

import { useState, useEffect } from "react";
import { getVaccineAlerts, VaccineAlert } from "@/services/api";
import { SkeletonBlock } from "./Skeleton";

const URGENCY_STYLES: Record<string, string> = {
  overdue: "bg-red-100 border-red-300 text-red-800",
  tomorrow: "bg-amber-100 border-amber-300 text-amber-800",
  upcoming: "bg-blue-100 border-blue-300 text-blue-800",
};

const URGENCY_BADGE: Record<string, string> = {
  overdue: "bg-red-500 text-white",
  tomorrow: "bg-amber-500 text-white",
  upcoming: "bg-blue-500 text-white",
};

const URGENCY_LABEL: Record<string, string> = {
  overdue: "Overdue!",
  tomorrow: "Tomorrow",
  upcoming: "In 2 days",
};

export default function VaccineAlertWidget() {
  const [alerts, setAlerts] = useState<VaccineAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await getVaccineAlerts();
        setAlerts(data.alerts);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || "Failed to load vaccine alerts";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-3">
          <SkeletonBlock className="h-20 w-full" />
          <SkeletonBlock className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-800">
          Vaccine Alerts
        </h3>
        {alerts.length > 0 && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
            {alerts.length} pending
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && alerts.length === 0 && (
        <div className="rounded-lg bg-emerald-50 p-4 text-center text-sm text-emerald-700">
          No upcoming vaccines in the next 2 days.
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.logId}
            className={`rounded-lg border-2 p-4 ${URGENCY_STYLES[alert.urgency]}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold">
                {alert.medicineName}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${URGENCY_BADGE[alert.urgency]}`}
              >
                {URGENCY_LABEL[alert.urgency]}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs opacity-80">
              <span className="font-semibold">
                {alert.animal.identityNumber}
                {alert.animal.name && ` (${alert.animal.name})`}
              </span>
              <span>Dose: {alert.dosage}</span>
              <span>
                {new Date(alert.nextDoseDate).toLocaleDateString("en-BD")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
