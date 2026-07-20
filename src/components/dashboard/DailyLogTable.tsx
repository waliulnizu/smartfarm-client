"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  submitDailyLog,
  getMyAnimals,
  AnimalListItem,
} from "@/services/api";
import { AnimalType } from "@/context/AnimalTypeContext";
import { SkeletonTable, SkeletonBlock } from "./Skeleton";

interface DailyLogTableProps {
  animalType: AnimalType;
  onSuccess?: () => void;
}

const INPUT_CLASS =
  "w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

interface RowData {
  animalId: string;
  feed: string;
  weight: string;
  milk: string;
  eggs: string;
  healthNotes: string;
  extraMedicine: string;
  isFeedDeficit: boolean;
}

export default function DailyLogTable({
  animalType,
  onSuccess,
}: DailyLogTableProps) {
  const [animals, setAnimals] = useState<AnimalListItem[]>([]);
  const [rows, setRows] = useState<Record<string, RowData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const showDairy = animalType === "Cow" || animalType === "Goat";
  const showPoultry = animalType === "Hen" || animalType === "Duck";

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  useEffect(() => {
    let cancelled = false;

    async function loadAnimals() {
      setIsLoading(true);
      try {
        const data = await getMyAnimals();
        const filtered = data.animals.filter((a) => a.type === animalType);
        if (!cancelled) {
          setAnimals(filtered);
          const initialRows: Record<string, RowData> = {};
          for (const a of filtered) {
            initialRows[a._id] = {
              animalId: a._id,
              feed: "",
              weight: "",
              milk: "",
              eggs: "",
              healthNotes: "",
              extraMedicine: "",
              isFeedDeficit: false,
            };
          }
          setRows(initialRows);
        }
      } catch {
        if (!cancelled) setAnimals([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadAnimals();
    return () => {
      cancelled = true;
    };
  }, [animalType]);

  function updateRow(id: string, field: keyof RowData, value: string | boolean) {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedCount(0);

    const entries = animals
      .filter((a) => rows[a._id]?.feed && rows[a._id]?.weight)
      .map((a) => {
        const r = rows[a._id];
        return submitDailyLog({
          animalId: a._id,
          date,
          feedConsumedKg: parseFloat(r.feed) || 0,
          currentWeight: parseFloat(r.weight) || 0,
          milkCollectedLiters: showDairy ? (parseFloat(r.milk) || 0) : undefined,
          eggsCollectedCount: showPoultry ? (parseInt(r.eggs, 10) || 0) : undefined,
          healthNotes: r.healthNotes || undefined,
          extraMedicine: r.extraMedicine || undefined,
          isFeedDeficit: r.isFeedDeficit,
        });
      });

    if (entries.length === 0) {
      setError("Fill feed & weight for at least one animal");
      setIsSaving(false);
      return;
    }

    try {
      await Promise.all(entries);
      setSavedCount(entries.length);

      const resetRows: Record<string, RowData> = {};
      for (const a of animals) {
        resetRows[a._id] = {
          animalId: a._id,
          feed: "",
          weight: "",
          milk: "",
          eggs: "",
          healthNotes: "",
          extraMedicine: "",
          isFeedDeficit: false,
        };
      }
      setRows(resetRows);
      onSuccess?.();
    } catch {
      setError("Failed to save some entries. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="h-9 w-32" />
        </div>
        <SkeletonTable rows={3} />
      </div>
    );
  }

  if (animals.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-zinc-800">
          Daily Log Entry — {animalType}s
        </h3>
        <div className="rounded-lg bg-zinc-50 py-8 text-center text-sm text-zinc-400">
          No {animalType.toLowerCase()}s registered yet.
        </div>
      </div>
    );
  }

  const filledCount = animals.filter(
    (a) => rows[a._id]?.feed && rows[a._id]?.weight
  ).length;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-800">
              Daily Log Entry — {animalType}s
            </h3>
            <p className="text-xs text-zinc-400">
              {animals.length} registered · {filledCount} ready to save
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={INPUT_CLASS}
            />
            <button
              type="submit"
              disabled={isSaving || filledCount === 0}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {isSaving ? (
                <>Saving {filledCount}...</>
              ) : (
                `Save All (${filledCount})`
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {savedCount > 0 && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {savedCount} log{savedCount !== 1 ? "s" : ""} saved successfully!
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-medium uppercase text-zinc-500">
                <th className="sticky left-0 z-10 bg-white pb-2 pr-3">ID</th>
                {!showPoultry && <th className="pb-2 pr-3">Name</th>}
                <th className="pb-2 pr-3">Feed (kg)</th>
                <th className="pb-2 pr-3">Weight (kg)</th>
                {showDairy && <th className="pb-2 pr-3">Milk (L)</th>}
                {showPoultry && <th className="pb-2 pr-3">Eggs</th>}
                <th className="pb-2 pr-3">Health</th>
                <th className="pb-2 pr-3">Medicine</th>
                <th className="pb-2 pr-2">Deficit</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((a) => {
                const r = rows[a._id];
                if (!r) return null;
                return (
                  <tr
                    key={a._id}
                    className="border-b border-zinc-100 hover:bg-zinc-50"
                  >
                    <td className="sticky left-0 z-10 bg-white py-2 pr-3 font-semibold text-zinc-800">
                      {a.identityNumberOrBatchName}
                    </td>
                    {!showPoultry && (
                      <td className="py-2 pr-3 text-zinc-600">
                        {a.name || "-"}
                      </td>
                    )}
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={r.feed}
                        onChange={(e) =>
                          updateRow(a._id, "feed", e.target.value)
                        }
                        placeholder="kg"
                        className={INPUT_CLASS}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={r.weight}
                        onChange={(e) =>
                          updateRow(a._id, "weight", e.target.value)
                        }
                        placeholder="kg"
                        className={INPUT_CLASS}
                      />
                    </td>
                    {showDairy && (
                      <td className="py-2 pr-3">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={r.milk}
                          onChange={(e) =>
                            updateRow(a._id, "milk", e.target.value)
                          }
                          placeholder="L"
                          className={INPUT_CLASS}
                        />
                      </td>
                    )}
                    {showPoultry && (
                      <td className="py-2 pr-3">
                        <input
                          type="number"
                          min="0"
                          value={r.eggs}
                          onChange={(e) =>
                            updateRow(a._id, "eggs", e.target.value)
                          }
                          placeholder="count"
                          className={INPUT_CLASS}
                        />
                      </td>
                    )}
                    <td className="py-2 pr-3">
                      <input
                        type="text"
                        value={r.healthNotes}
                        onChange={(e) =>
                          updateRow(a._id, "healthNotes", e.target.value)
                        }
                        placeholder="Notes"
                        className={INPUT_CLASS}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="text"
                        value={r.extraMedicine}
                        onChange={(e) =>
                          updateRow(a._id, "extraMedicine", e.target.value)
                        }
                        placeholder="Medicine"
                        className={INPUT_CLASS}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="checkbox"
                        checked={r.isFeedDeficit}
                        onChange={(e) =>
                          updateRow(a._id, "isFeedDeficit", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
}
