"use client";

import { useState, FormEvent, useEffect } from "react";
import { useAnimalType } from "@/context/AnimalTypeContext";
import {
  createAnimal,
  getNextAnimalId,
  AnimalPayload,
} from "@/services/api";

const INPUT_CLASS =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

interface AnimalRegistrationFormProps {
  onSuccess?: () => void;
}

export default function AnimalRegistrationForm({ onSuccess }: AnimalRegistrationFormProps) {
  const { selectedType, theme } = useAnimalType();
  const isPoultry = selectedType === "Hen" || selectedType === "Duck";
  const isLivestock = selectedType === "Cow" || selectedType === "Goat";

  const [identityNumber, setIdentityNumber] = useState("");
  const [name, setName] = useState("");
  const [ringNumber, setRingNumber] = useState("");
  const [breed, setBreed] = useState("");
  const [averageFeedKg, setAverageFeedKg] = useState("");
  const [entryWeight, setEntryWeight] = useState("");
  const [gender, setGender] = useState("");
  const [subType, setSubType] = useState("");
  const [isPregnant, setIsPregnant] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadNext() {
      try {
        const { nextId } = await getNextAnimalId(selectedType);
        if (!cancelled) setIdentityNumber(nextId);
      } catch {
        if (!cancelled) setIdentityNumber(`${selectedType[0]}-1`);
      }
    }
    loadNext();
    return () => {
      cancelled = true;
    };
  }, [selectedType]);

  function resetForm() {
    setIdentityNumber("");
    setName("");
    setRingNumber("");
    setBreed("");
    setAverageFeedKg("");
    setEntryWeight("");
    setGender("");
    setSubType("");
    setIsPregnant(false);
  }

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadNextId() {
    try {
      const { nextId } = await getNextAnimalId(selectedType);
      setIdentityNumber(nextId);
    } catch {
      setIdentityNumber(`${selectedType[0]}-1`);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setToast(null);

    const payload: AnimalPayload = {
      type: selectedType,
      identityNumberOrBatchName: identityNumber,
      identificationType: isPoultry ? "leg-ring" : "neck-tag",
      breed,
      averageFeedKg: parseFloat(averageFeedKg) || 0,
      entryWeight: parseFloat(entryWeight) || 0,
    };

    if (!isPoultry && name) payload.name = name;
    if (isPoultry && ringNumber) payload.ringNumber = ringNumber;

    if (isLivestock) {
      if (gender) payload.gender = gender;
      if (subType) payload.subType = subType;
      if (isPregnant) payload.isPregnant = true;
    }

    try {
      await createAnimal(payload);
      showToast("success", `${selectedType} registered successfully!`);
      resetForm();
      loadNextId();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to register animal.";
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`relative rounded-xl border-2 ${theme.accentBorder} bg-white p-6 shadow-sm`}>
      {toast && (
        <div
          className={`absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h3 className={`mb-4 text-lg font-semibold ${theme.accent}`}>
        Register New {selectedType}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              {isPoultry ? "Batch / Flock Name *" : "Tag Number (on neck) *"}
            </label>
            <input
              type="text"
              required
              value={identityNumber}
              readOnly
              className={`${INPUT_CLASS} cursor-not-allowed bg-zinc-50`}
            />
            <p className="mt-1 text-xs text-zinc-400">Auto-generated</p>
          </div>

          {!isPoultry && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-600">
                Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lalghoda"
                className={INPUT_CLASS}
              />
            </div>
          )}

          {isPoultry && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-600">
                Ring Number (on leg) *
              </label>
              <input
                type="text"
                required
                value={ringNumber}
                onChange={(e) => setRingNumber(e.target.value)}
                placeholder="e.g. R-001"
                className={INPUT_CLASS}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Breed *
            </label>
            <input
              type="text"
              required
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="e.g. Holstein"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Entry Weight (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              required
              value={entryWeight}
              onChange={(e) => setEntryWeight(e.target.value)}
              placeholder="e.g. 250"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Average Daily Feed (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={averageFeedKg}
              onChange={(e) => setAverageFeedKg(e.target.value)}
              placeholder="e.g. 12"
              className={INPUT_CLASS}
            />
          </div>

          {isLivestock && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={INPUT_CLASS}
                >
                  <option value="">Select...</option>
                  <option value="Male">♂ Male</option>
                  <option value="Female">♀ Female</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600">
                  Category
                </label>
                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  className={INPUT_CLASS}
                >
                  <option value="">Select...</option>
                  {selectedType === "Cow" && (
                    <>
                      <option value="Milch Cow">Milch Cow</option>
                      <option value="Heifer">Heifer</option>
                      <option value="Ox">Ox</option>
                      <option value="Calf">Calf</option>
                    </>
                  )}
                  {selectedType === "Goat" && (
                    <>
                      <option value="Calf">Calf (Bachur)</option>
                      <option value="Ox">Ox (Khassi)</option>
                      <option value="Heifer">Heifer</option>
                    </>
                  )}
                </select>
              </div>

              {gender === "Female" && subType !== "Calf" && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPregnant"
                    checked={isPregnant}
                    onChange={(e) => setIsPregnant(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-400"
                  />
                  <label htmlFor="isPregnant" className="text-sm font-medium text-zinc-600">
                    🤰 Pregnant (Goruhoti)
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Registering...
            </>
          ) : (
            `Register ${selectedType}`
          )}
        </button>
      </form>
    </div>
  );
}
