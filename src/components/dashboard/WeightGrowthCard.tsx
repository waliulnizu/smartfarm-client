"use client";

import { useState, useEffect, useRef } from "react";
import {
  getWeightGrowth,
  WeightGrowthResponse,
  getMyAnimals,
  AnimalListItem,
} from "@/services/api";
import { SkeletonBlock } from "./Skeleton";

const DAY_OPTIONS = [
  { label: "7 Days", value: 7 },
  { label: "15 Days", value: 15 },
  { label: "30 Days", value: 30 },
] as const;

const INPUT_CLASS =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

export default function WeightGrowthCard() {
  const [animals, setAnimals] = useState<AnimalListItem[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalListItem | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingAnimals, setIsLoadingAnimals] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [days, setDays] = useState<number>(15);
  const [result, setResult] = useState<WeightGrowthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnimals() {
      try {
        const data = await getMyAnimals();
        setAnimals(
          data.animals.filter(
            (a) => a.type === "Cow" || a.type === "Goat"
          )
        );
      } catch {
        setAnimals([]);
      } finally {
        setIsLoadingAnimals(false);
      }
    }
    loadAnimals();
  }, []);

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
      (a.name && a.name.toLowerCase().includes(q))
    );
  });

  function getAnimalLabel(animal: AnimalListItem): string {
    if (animal.name) {
      return `${animal.identityNumberOrBatchName} - ${animal.name}`;
    }
    return animal.identityNumberOrBatchName;
  }

  function selectAnimal(animal: AnimalListItem) {
    setSelectedAnimal(animal);
    setSearchQuery(getAnimalLabel(animal));
    setShowDropdown(false);
  }

  async function handleSearch() {
    if (!selectedAnimal) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await getWeightGrowth(selectedAnimal._id, days);
      setResult(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to fetch weight growth data.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  const isPositive = result ? result.netWeightChange >= 0 : false;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-zinc-800">
        Weight Growth Tracker
      </h3>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div ref={dropdownRef} className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedAnimal(null);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search by ID or name..."
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
                  </span>
                  <span className="text-xs text-zinc-400">{animal.breed}</span>
                </button>
              ))}
            </div>
          )}
          {showDropdown && searchQuery.length > 0 && filtered.length === 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-400 shadow-lg">
              No match found
            </div>
          )}
        </div>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          {DAY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          disabled={isLoading || !selectedAnimal}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonBlock className="h-24 w-full" />
          <SkeletonBlock className="h-24 w-full" />
          <SkeletonBlock className="h-24 w-full" />
          <SkeletonBlock className="h-24 w-full" />
        </div>
      )}

      {result && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-50 p-4">
            <p className="text-xs font-medium text-zinc-500">Latest Weight</p>
            <p className="text-2xl font-bold text-zinc-800">
              {result.latestRecord.weight} kg
            </p>
            <p className="text-xs text-zinc-400">
              {new Date(result.latestRecord.date).toLocaleDateString()}
            </p>
          </div>

          <div className="rounded-lg bg-zinc-50 p-4">
            <p className="text-xs font-medium text-zinc-500">
              Previous Weight ({result.dayRange}d ago)
            </p>
            <p className="text-2xl font-bold text-zinc-800">
              {result.previousRecord.weight} kg
            </p>
            <p className="text-xs text-zinc-400">
              {new Date(result.previousRecord.date).toLocaleDateString()}
            </p>
          </div>

          <div className="rounded-lg bg-zinc-50 p-4">
            <p className="text-xs font-medium text-zinc-500">
              Net Weight Change
            </p>
            <p
              className={`text-2xl font-bold ${
                isPositive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {result.netWeightChange} kg
            </p>
          </div>

          <div className="rounded-lg bg-zinc-50 p-4">
            <p className="text-xs font-medium text-zinc-500">
              Percentage Change
            </p>
            <p
              className={`text-2xl font-bold ${
                isPositive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {result.percentageChange}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
