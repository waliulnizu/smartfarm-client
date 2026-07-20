"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  getMyAnimals,
  AnimalListItem,
  updateAnimal,
  deleteAnimal,
  submitDailyLog,
  getWeightScheduleAlerts,
  WeightScheduleAlert,
} from "@/services/api";
import { AnimalType } from "@/context/AnimalTypeContext";
import { SkeletonTable, SkeletonBlock } from "./Skeleton";

const PAGE_SIZE = 10;

const STATUS_STYLE: Record<string, string> = {
  healthy: "bg-emerald-100 text-emerald-700",
  sick: "bg-red-100 text-red-700",
};

const INPUT_CLASS =
  "w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

const WEIGHT_OVERDUE_CLASS =
  "w-full rounded-lg border-2 border-red-400 bg-red-50 px-2 py-1.5 text-sm text-zinc-900 placeholder-red-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200";

const WEIGHT_DUE_TODAY_CLASS =
  "w-full rounded-lg border-2 border-amber-400 bg-amber-50 px-2 py-1.5 text-sm text-zinc-900 placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200";

type CategoryFilter = "all" | "male" | "female" | "calf" | "pregnant";

const CATEGORY_LABELS: Record<CategoryFilter, { label: string; icon: string; color: string; activeColor: string }> = {
  all: { label: "All", icon: "", color: "border-transparent text-zinc-500 hover:bg-zinc-100", activeColor: "border-zinc-500 bg-zinc-100 text-zinc-800" },
  male: { label: "Male", icon: "♂", color: "border-transparent text-blue-500 hover:bg-blue-50", activeColor: "border-blue-400 bg-blue-100 text-blue-800" },
  female: { label: "Female", icon: "♀", color: "border-transparent text-pink-500 hover:bg-pink-50", activeColor: "border-pink-400 bg-pink-100 text-pink-800" },
  calf: { label: "Calf", icon: "🐾", color: "border-transparent text-violet-500 hover:bg-violet-50", activeColor: "border-violet-400 bg-violet-100 text-violet-800" },
  pregnant: { label: "Pregnant", icon: "🤰", color: "border-transparent text-amber-600 hover:bg-amber-50", activeColor: "border-amber-400 bg-amber-100 text-amber-800" },
};

const GENDER_BADGE: Record<string, string> = {
  Male: "bg-blue-100 text-blue-700",
  Female: "bg-pink-100 text-pink-700",
};

const SUBTYPE_BADGE: Record<string, string> = {
  Calf: "bg-violet-100 text-violet-700",
  Ox: "bg-sky-100 text-sky-700",
  Heifer: "bg-pink-100 text-pink-700",
  "Milch Cow": "bg-emerald-100 text-emerald-700",
};

interface RowData {
  animalId: string;
  feed: string;
  weight: string;
  milk: string;
  eggs: string;
  healthNotes: string;
  extraMedicine: string;
  isFeedDeficit: boolean;
  isLate: boolean;
}

interface AnimalSectionProps {
  animalType: AnimalType;
  refreshKey?: number;
  onAnimalChange?: () => void;
}

export default function AnimalSection({
  animalType,
  refreshKey = 0,
  onAnimalChange,
}: AnimalSectionProps) {
  const [animals, setAnimals] = useState<AnimalListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "log">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const isPoultry = animalType === "Hen" || animalType === "Duck";
  const showDairy = animalType === "Cow" || animalType === "Goat";
  const showWeightAlerts = animalType === "Cow" || animalType === "Goat";

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBreed, setEditBreed] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editFeed, setEditFeed] = useState("");
  const [editStatus, setEditStatus] = useState("healthy");
  const [isSaving, setIsSaving] = useState(false);

  const [rows, setRows] = useState<Record<string, RowData>>({});
  const [logSavedCount, setLogSavedCount] = useState(0);
  const [logError, setLogError] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const [weightAlerts, setWeightAlerts] = useState<WeightScheduleAlert[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const [animalData, alertData] = await Promise.all([
          getMyAnimals(),
          showWeightAlerts ? getWeightScheduleAlerts() : Promise.resolve({ alerts: [] }),
        ]);
        if (!cancelled) {
          const filtered = animalData.animals.filter((a) => a.type === animalType);
          setAnimals(filtered);

          const alertMap: Record<string, WeightScheduleAlert> = {};
          for (const alert of alertData.alerts) {
            alertMap[alert.animalId] = alert;
          }
          setWeightAlerts(alertData.alerts);

          const r: Record<string, RowData> = {};
          for (const a of filtered) {
            const alert = alertMap[a._id];
            const isOverdue = !!alert;
            r[a._id] = {
              animalId: a._id,
              feed: "",
              weight: "",
              milk: "",
              eggs: "",
              healthNotes: "",
              extraMedicine: "",
              isFeedDeficit: false,
              isLate: isOverdue,
            };
          }
          setRows(r);
        }
      } catch {
        if (!cancelled) setAnimals([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [animalType, refreshKey, showWeightAlerts]);

  useEffect(() => { setPage(1); }, [searchQuery, categoryFilter]);

  const filtered = animals.filter((a) => {
    if (categoryFilter === "male" && a.gender !== "Male") return false;
    if (categoryFilter === "female" && a.gender !== "Female") return false;
    if (categoryFilter === "calf" && a.subType !== "Calf") return false;
    if (categoryFilter === "pregnant" && !a.isPregnant) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.identityNumberOrBatchName.toLowerCase().includes(q) ||
      (a.name && a.name.toLowerCase().includes(q)) ||
      a.breed.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const filledCount = animals.filter((a) => rows[a._id]?.feed && rows[a._id]?.weight).length;

  function getAlertForAnimal(animalId: string): WeightScheduleAlert | undefined {
    return weightAlerts.find((a) => a.animalId === animalId);
  }

  function getWeightInputClass(animalId: string): string {
    const alert = getAlertForAnimal(animalId);
    if (!alert) return INPUT_CLASS;
    if (alert.urgency === "overdue") return WEIGHT_OVERDUE_CLASS;
    if (alert.urgency === "overdue-soon" || alert.urgency === "due-today") return WEIGHT_DUE_TODAY_CLASS;
    return INPUT_CLASS;
  }

  function startEdit(animal: AnimalListItem) {
    setEditingId(animal._id);
    setEditName(animal.name || "");
    setEditBreed(animal.breed);
    setEditWeight(String(animal.entryWeight));
    setEditFeed(String(animal.averageFeedKg));
    setEditStatus(animal.status);
  }

  function cancelEdit() { setEditingId(null); }

  async function saveEdit(id: string) {
    setIsSaving(true);
    try {
      await updateAnimal(id, {
        name: editName || undefined,
        breed: editBreed,
        entryWeight: parseFloat(editWeight) || 0,
        averageFeedKg: parseFloat(editFeed) || 0,
        status: editStatus as "healthy" | "sick",
      });
      setEditingId(null);
      onAnimalChange?.();
    } catch { /* keep editing */ } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this animal?")) return;
    try {
      await deleteAnimal(id);
      onAnimalChange?.();
    } catch { /* ignore */ }
  }

  function updateRow(id: string, field: keyof RowData, value: string | boolean) {
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function handleLogSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setLogError(null);
    setLogSavedCount(0);

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
          eggsCollectedCount: isPoultry ? (parseInt(r.eggs, 10) || 0) : undefined,
          healthNotes: r.healthNotes || undefined,
          extraMedicine: r.extraMedicine || undefined,
          isFeedDeficit: r.isFeedDeficit,
        });
      });

    if (entries.length === 0) {
      setLogError("Fill feed & weight for at least one animal");
      setIsSaving(false);
      return;
    }

    try {
      await Promise.all(entries);
      setLogSavedCount(entries.length);
      const reset: Record<string, RowData> = {};
      for (const a of animals) {
        reset[a._id] = {
          animalId: a._id,
          feed: "", weight: "", milk: "", eggs: "",
          healthNotes: "", extraMedicine: "", isFeedDeficit: false,
          isLate: false,
        };
      }
      setRows(reset);
      onAnimalChange?.();
    } catch {
      setLogError("Failed to save some entries. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <SkeletonBlock className="mb-4 h-5 w-40" />
        <SkeletonTable rows={3} />
      </div>
    );
  }

  function renderPagination() {
    if (totalPages <= 1) return null;
    return (
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={pageSafe <= 1}
          className="rounded border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - pageSafe) <= 1)
          .reduce<(number | "...")[]>((acc, p, i, arr) => {
            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "..." ? (
              <span key={`e${i}`} className="px-1 text-xs text-zinc-400">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`rounded border px-3 py-1 text-xs font-medium ${
                  p === pageSafe
                    ? "border-emerald-500 bg-emerald-600 text-white"
                    : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {p}
              </button>
            )
          )}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={pageSafe >= totalPages}
          className="rounded border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );
  }

  const overdueCount = weightAlerts.filter((a) => a.urgency === "overdue").length;
  const dueTodayCount = weightAlerts.filter((a) => a.urgency === "due-today" || a.urgency === "overdue-soon").length;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      {showWeightAlerts && weightAlerts.length > 0 && (
        <div className="mx-6 mt-4 flex items-center gap-3">
          {overdueCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              {overdueCount} overdue weight{overdueCount !== 1 ? "s" : ""}
            </span>
          )}
          {dueTodayCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              {dueTodayCount} due soon
            </span>
          )}
        </div>
      )}

      {showDairy && (
        <div className="mx-6 mt-4 flex items-center gap-2">
          {(Object.keys(CATEGORY_LABELS) as CategoryFilter[]).map((key) => {
            const cat = CATEGORY_LABELS[key];
            const count = key === "all"
              ? animals.length
              : key === "male"
                ? animals.filter((a) => a.gender === "Male").length
                : key === "female"
                  ? animals.filter((a) => a.gender === "Female").length
                  : key === "calf"
                    ? animals.filter((a) => a.subType === "Calf").length
                    : animals.filter((a) => a.isPregnant).length;
            const isActive = categoryFilter === key;
            return (
              <button
                key={key}
                onClick={() => setCategoryFilter(key)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all ${isActive ? cat.activeColor : cat.color}`}
              >
                {cat.icon && <span>{cat.icon}</span>}
                {cat.label}
                <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? "bg-white/60" : "bg-zinc-100"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center border-b border-zinc-200 px-6">
        <button
          onClick={() => setActiveTab("list")}
          className={`mr-6 border-b-2 pb-3 pt-4 text-sm font-semibold transition-colors ${
            activeTab === "list"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Registered ({animals.length})
        </button>
        <button
          onClick={() => setActiveTab("log")}
          className={`mr-6 border-b-2 pb-3 pt-4 text-sm font-semibold transition-colors ${
            activeTab === "log"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Daily Log ({filledCount} ready)
        </button>
        <div className="ml-auto pb-3 pt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search${!isPoultry ? " ID, name," : " ID,"} breed...`}
            className="w-56 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>

      <div className="p-6">
        {animals.length === 0 ? (
          <div className="rounded-lg bg-zinc-50 py-8 text-center text-sm text-zinc-400">
            No {animalType.toLowerCase()}s registered yet.
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg bg-zinc-50 py-8 text-center text-sm text-zinc-400">
            No match found for &quot;{searchQuery}&quot;
          </div>
        ) : activeTab === "list" ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs font-medium uppercase text-zinc-500">
                    <th className="pb-2 pr-4">ID</th>
                    {!isPoultry && <th className="pb-2 pr-4">Name</th>}
                    {!isPoultry && showDairy && <th className="pb-2 pr-4">Category</th>}
                    <th className="pb-2 pr-4">Breed</th>
                    <th className="pb-2 pr-4">Weight</th>
                    <th className="pb-2 pr-4">Feed/Day</th>
                    <th className="pb-2 pr-4">Status</th>
                    {showWeightAlerts && <th className="pb-2 pr-4">Weight Due</th>}
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((animal) => {
                    const isEditing = editingId === animal._id;
                    const alert = showWeightAlerts ? getAlertForAnimal(animal._id) : undefined;
                    return (
                      <tr key={animal._id} className="border-b border-zinc-100 last:border-0">
                        <td className="py-3 pr-4 font-semibold text-zinc-800">
                          {animal.identityNumberOrBatchName}
                          {animal.ringNumber && <span className="ml-1 text-xs text-zinc-400">(R:{animal.ringNumber})</span>}
                        </td>
                        {!isPoultry && (
                          <td className="py-3 pr-4 text-zinc-600">
                            {isEditing ? <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" className={INPUT_CLASS} /> : (animal.name || "-")}
                          </td>
                        )}
                        {!isPoultry && showDairy && (
                          <td className="py-3 pr-4">
                            <div className="flex flex-wrap items-center gap-1">
                              {animal.gender && (
                                <span className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${GENDER_BADGE[animal.gender] || "bg-zinc-100 text-zinc-600"}`}>
                                  {animal.gender === "Male" ? "♂ Male" : "♀ Female"}
                                </span>
                              )}
                              {animal.subType && (
                                <span className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${SUBTYPE_BADGE[animal.subType] || "bg-zinc-100 text-zinc-600"}`}>
                                  {animal.subType}
                                </span>
                              )}
                              {animal.isPregnant && (
                                <span className="inline-block rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                                  Pregnant
                                </span>
                              )}
                              {!animal.gender && !animal.subType && <span className="text-xs text-zinc-400">-</span>}
                            </div>
                          </td>
                        )}
                        <td className="py-3 pr-4 text-zinc-600">
                          {isEditing ? <input type="text" value={editBreed} onChange={(e) => setEditBreed(e.target.value)} className={INPUT_CLASS} /> : animal.breed}
                        </td>
                        <td className="py-3 pr-4 text-zinc-600">
                          {isEditing ? <input type="number" step="0.1" min="0" value={editWeight} onChange={(e) => setEditWeight(e.target.value)} className={INPUT_CLASS} /> : `${animal.entryWeight} kg`}
                        </td>
                        <td className="py-3 pr-4 text-zinc-600">
                          {isEditing ? <input type="number" step="0.1" min="0" value={editFeed} onChange={(e) => setEditFeed(e.target.value)} className={INPUT_CLASS} /> : `${animal.averageFeedKg} kg`}
                        </td>
                        <td className="py-3 pr-4">
                          {isEditing ? (
                            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className={INPUT_CLASS}>
                              <option value="healthy">Healthy</option>
                              <option value="sick">Sick</option>
                            </select>
                          ) : (
                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[animal.status] || "bg-zinc-100 text-zinc-600"}`}>{animal.status}</span>
                          )}
                        </td>
                        {showWeightAlerts && (
                          <td className="py-3 pr-4">
                            {alert ? (
                              <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                                alert.urgency === "overdue" ? "bg-red-100 text-red-700" :
                                alert.urgency === "overdue-soon" || alert.urgency === "due-today"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-zinc-100 text-zinc-600"
                              }`}>
                                {alert.urgency === "overdue" && `${alert.overdueDays}d overdue`}
                                {alert.urgency === "overdue-soon" && `${alert.overdueDays}d overdue`}
                                {alert.urgency === "due-today" && "Due today"}
                              </span>
                            ) : (
                              <span className="text-xs text-zinc-400">-</span>
                            )}
                          </td>
                        )}
                        <td className="py-3 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => saveEdit(animal._id)} disabled={isSaving} className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{isSaving ? "Saving..." : "Save"}</button>
                              <button onClick={cancelEdit} className="rounded bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-300">Cancel</button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => startEdit(animal)} className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">Edit</button>
                              <button onClick={() => handleDelete(animal._id)} className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        ) : (
          <form onSubmit={handleLogSubmit}>
            <div className="mb-4 flex items-center justify-end gap-3">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={INPUT_CLASS} />
              <button type="submit" disabled={isSaving || filledCount === 0} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400">
                {isSaving ? `Saving ${filledCount}...` : `Save All (${filledCount})`}
              </button>
            </div>

            {logError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{logError}</div>}
            {logSavedCount > 0 && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{logSavedCount} log{logSavedCount !== 1 ? "s" : ""} saved successfully!</div>}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs font-medium uppercase text-zinc-500">
                    <th className="sticky left-0 z-10 bg-white pb-2 pr-3">ID</th>
                    {!isPoultry && <th className="pb-2 pr-3">Name</th>}
                    <th className="pb-2 pr-3">Feed (kg)</th>
                    <th className="pb-2 pr-3">Weight (kg)</th>
                    {showDairy && <th className="pb-2 pr-3">Milk (L)</th>}
                    {isPoultry && <th className="pb-2 pr-3">Eggs</th>}
                    <th className="pb-2 pr-3">Health</th>
                    <th className="pb-2 pr-3">Medicine</th>
                    <th className="pb-2 pr-2">Deficit</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((a) => {
                    const r = rows[a._id];
                    if (!r) return null;
                    const alert = showWeightAlerts ? getAlertForAnimal(a._id) : undefined;
                    return (
                      <tr key={a._id} className={`border-b border-zinc-100 hover:bg-zinc-50 ${alert ? "bg-red-25" : ""}`}>
                        <td className="sticky left-0 z-10 bg-white py-2 pr-3 font-semibold text-zinc-800">
                          {a.identityNumberOrBatchName}
                          {alert && (
                            <span className={`ml-1 inline-block rounded px-1 text-[10px] font-bold ${
                              alert.urgency === "overdue" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                            }`}>
                              {alert.urgency === "overdue" ? "LATE" : "DUE"}
                            </span>
                          )}
                        </td>
                        {!isPoultry && <td className="py-2 pr-3 text-zinc-600">{a.name || "-"}</td>}
                        <td className="py-2 pr-3"><input type="number" step="0.1" min="0" value={r.feed} onChange={(e) => updateRow(a._id, "feed", e.target.value)} placeholder="kg" className={INPUT_CLASS} /></td>
                        <td className="py-2 pr-3">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={r.weight}
                            onChange={(e) => updateRow(a._id, "weight", e.target.value)}
                            placeholder={alert ? "Required!" : "kg"}
                            className={getWeightInputClass(a._id)}
                          />
                        </td>
                        {showDairy && <td className="py-2 pr-3"><input type="number" step="0.1" min="0" value={r.milk} onChange={(e) => updateRow(a._id, "milk", e.target.value)} placeholder="L" className={INPUT_CLASS} /></td>}
                        {isPoultry && <td className="py-2 pr-3"><input type="number" min="0" value={r.eggs} onChange={(e) => updateRow(a._id, "eggs", e.target.value)} placeholder="count" className={INPUT_CLASS} /></td>}
                        <td className="py-2 pr-3"><input type="text" value={r.healthNotes} onChange={(e) => updateRow(a._id, "healthNotes", e.target.value)} placeholder="Notes" className={INPUT_CLASS} /></td>
                        <td className="py-2 pr-3"><input type="text" value={r.extraMedicine} onChange={(e) => updateRow(a._id, "extraMedicine", e.target.value)} placeholder="Medicine" className={INPUT_CLASS} /></td>
                        <td className="py-2 pr-2"><input type="checkbox" checked={r.isFeedDeficit} onChange={(e) => updateRow(a._id, "isFeedDeficit", e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </form>
        )}
      </div>
    </div>
  );
}
