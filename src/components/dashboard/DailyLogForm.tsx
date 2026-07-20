"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import {
  submitDailyLog,
  DailyLogPayload,
  getMyAnimals,
  AnimalListItem,
} from "@/services/api";
import { SkeletonBlock } from "./Skeleton";

interface DailyLogFormProps {
  animalType: "Cow" | "Goat" | "Hen" | "Duck";
  onSuccess?: () => void;
}

const INPUT_CLASS =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

export default function DailyLogForm({
  animalType,
  onSuccess,
}: DailyLogFormProps) {
  const [animals, setAnimals] = useState<AnimalListItem[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalListItem | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingAnimals, setIsLoadingAnimals] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState("");
  const [feedConsumedKg, setFeedConsumedKg] = useState("");
  const [milkCollectedLiters, setMilkCollectedLiters] = useState("");
  const [eggsCollectedCount, setEggsCollectedCount] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [healthNotes, setHealthNotes] = useState("");
  const [extraMedicine, setExtraMedicine] = useState("");
  const [isFeedDeficit, setIsFeedDeficit] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showDairy = animalType === "Cow" || animalType === "Goat";
  const showPoultry = animalType === "Hen" || animalType === "Duck";

  useEffect(() => {
    async function loadAnimals() {
      try {
        const data = await getMyAnimals();
        setAnimals(data.animals.filter((a) => a.type === animalType));
      } catch {
        setAnimals([]);
      } finally {
        setIsLoadingAnimals(false);
      }
    }
    loadAnimals();
  }, [animalType]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = animals.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.identityNumberOrBatchName.toLowerCase().includes(q) ||
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.ringNumber && a.ringNumber.toLowerCase().includes(q))
    );
  });

  function resetForm() {
    setSelectedAnimal(null);
    setSearchQuery("");
    setDate("");
    setFeedConsumedKg("");
    setMilkCollectedLiters("");
    setEggsCollectedCount("");
    setCurrentWeight("");
    setHealthNotes("");
    setExtraMedicine("");
    setIsFeedDeficit(false);
  }

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function selectAnimal(animal: AnimalListItem) {
    setSelectedAnimal(animal);
    setSearchQuery(getAnimalLabel(animal));
    setShowDropdown(false);
  }

  function getAnimalLabel(animal: AnimalListItem): string {
    if (animal.name) {
      return `${animal.identityNumberOrBatchName} - ${animal.name}`;
    }
    if (animal.ringNumber) {
      return `${animal.identityNumberOrBatchName} (Ring: ${animal.ringNumber})`;
    }
    return animal.identityNumberOrBatchName;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedAnimal) return;
    setIsLoading(true);
    setToast(null);

    const payload: DailyLogPayload = {
      animalId: selectedAnimal._id,
      date: date || new Date().toISOString().split("T")[0],
      feedConsumedKg: parseFloat(feedConsumedKg),
      currentWeight: parseFloat(currentWeight),
      isFeedDeficit,
    };

    if (showDairy && milkCollectedLiters) {
      payload.milkCollectedLiters = parseFloat(milkCollectedLiters);
    }

    if (showPoultry && eggsCollectedCount) {
      payload.eggsCollectedCount = parseInt(eggsCollectedCount, 10);
    }

    if (healthNotes) payload.healthNotes = healthNotes;
    if (extraMedicine) payload.extraMedicine = extraMedicine;

    try {
      await submitDailyLog(payload);
      showToast("success", "Daily log saved successfully!");
      resetForm();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save daily log. Please try again.";
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      {toast && (
        <div
          className={`absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h3 className="mb-4 text-lg font-semibold text-zinc-800">
        Daily Log Entry
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div ref={dropdownRef} className="relative">
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Search {showPoultry ? "Batch" : "Animal"} *
          </label>
          {isLoadingAnimals ? (
            <SkeletonBlock className="h-10 w-full" />
          ) : animals.length === 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              No registered {animalType} found. Please register one first.
            </div>
          ) : (
            <>
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedAnimal(null);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder={`Search by ID, name${showDairy ? "" : ""}...`}
                className={INPUT_CLASS}
              />
              {showDropdown && filtered.length > 0 && (
                <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg">
                  {filtered.map((animal) => (
                    <button
                      key={animal._id}
                      type="button"
                      onClick={() => selectAnimal(animal)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-emerald-50 ${
                        selectedAnimal?._id === animal._id
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-zinc-700"
                      }`}
                    >
                      <span className="font-medium">
                        {animal.identityNumberOrBatchName}
                        {animal.name && (
                          <span className="ml-1 text-zinc-500">
                            ({animal.name})
                          </span>
                        )}
                        {animal.ringNumber && (
                          <span className="ml-1 text-zinc-400">
                            Ring: {animal.ringNumber}
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {animal.breed}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {showDropdown &&
                searchQuery.length > 0 &&
                filtered.length === 0 && (
                  <div className="absolute z-20 mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-400 shadow-lg">
                    No match found
                  </div>
                )}
            </>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Feed Consumed (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              required
              value={feedConsumedKg}
              onChange={(e) => setFeedConsumedKg(e.target.value)}
              placeholder="e.g. 12.5"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Current Weight (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              required
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="e.g. 320"
              className={INPUT_CLASS}
            />
          </div>

          {showDairy && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-600">
                Milk Collected (liters)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={milkCollectedLiters}
                onChange={(e) => setMilkCollectedLiters(e.target.value)}
                placeholder="e.g. 8.5"
                className={INPUT_CLASS}
              />
            </div>
          )}

          {showPoultry && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-600">
                Eggs Collected
              </label>
              <input
                type="number"
                min="0"
                value={eggsCollectedCount}
                onChange={(e) => setEggsCollectedCount(e.target.value)}
                placeholder="e.g. 250"
                className={INPUT_CLASS}
              />
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Health Notes
            </label>
            <input
              type="text"
              value={healthNotes}
              onChange={(e) => setHealthNotes(e.target.value)}
              placeholder="e.g. Lethargic, coughing"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Extra Medicine (outside schedule)
            </label>
            <input
              type="text"
              value={extraMedicine}
              onChange={(e) => setExtraMedicine(e.target.value)}
              placeholder="e.g. Paracetamol 500mg"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="feedDeficit"
            checked={isFeedDeficit}
            onChange={(e) => setIsFeedDeficit(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="feedDeficit" className="text-sm text-zinc-600">
            Feed was less than usual today
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !selectedAnimal || animals.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            "Save Daily Log"
          )}
        </button>
      </form>
    </div>
  );
}
