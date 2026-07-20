"use client";

import { useState, useEffect, useRef } from "react";
import { getMyAnimals, AnimalListItem, updateAnimal, deleteAnimal } from "@/services/api";
import { AnimalType } from "@/context/AnimalTypeContext";
import { SkeletonTable, SkeletonBlock } from "./Skeleton";

const STATUS_STYLE: Record<string, string> = {
  healthy: "bg-emerald-100 text-emerald-700",
  sick: "bg-red-100 text-red-700",
};

const INPUT_CLASS =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

interface AnimalListProps {
  animalType: AnimalType;
  refreshKey?: number;
  onAnimalChange?: () => void;
}

export default function AnimalList({
  animalType,
  refreshKey = 0,
  onAnimalChange,
}: AnimalListProps) {
  const [animals, setAnimals] = useState<AnimalListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBreed, setEditBreed] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editFeed, setEditFeed] = useState("");
  const [editStatus, setEditStatus] = useState("healthy");
  const [isSaving, setIsSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await getMyAnimals();
        if (!cancelled) {
          setAnimals(data.animals.filter((a) => a.type === animalType));
        }
      } catch {
        if (!cancelled) setAnimals([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [animalType, refreshKey]);

  function startEdit(animal: AnimalListItem) {
    setEditingId(animal._id);
    setEditName(animal.name || "");
    setEditBreed(animal.breed);
    setEditWeight(String(animal.entryWeight));
    setEditFeed(String(animal.averageFeedKg));
    setEditStatus(animal.status);
  }

  function cancelEdit() {
    setEditingId(null);
  }

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
    } catch {
      // keep editing
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this animal?")) return;
    try {
      await deleteAnimal(id);
      onAnimalChange?.();
    } catch {
      // ignore
    }
  }

  const isPoultry = animalType === "Hen" || animalType === "Duck";
  const filtered = animals.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.identityNumberOrBatchName.toLowerCase().includes(q) ||
      (a.name && a.name.toLowerCase().includes(q)) ||
      a.breed.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-5 w-8 rounded-full" />
        </div>
        <SkeletonTable rows={3} />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-800">
          Registered {animalType}s
        </h3>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
          {animals.length}
        </span>
      </div>

      {animals.length > 0 && (
        <div className="mb-4" ref={dropdownRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search by ID${!isPoultry ? ", name" : ""}, breed...`}
            className={INPUT_CLASS}
          />
        </div>
      )}

      {animals.length === 0 ? (
        <div className="rounded-lg bg-zinc-50 py-8 text-center text-sm text-zinc-400">
          No {animalType.toLowerCase()}s registered yet.
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg bg-zinc-50 py-8 text-center text-sm text-zinc-400">
          No match found for &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-medium uppercase text-zinc-500">
                <th className="pb-2 pr-4">ID</th>
                {!isPoultry && <th className="pb-2 pr-4">Name</th>}
                <th className="pb-2 pr-4">Breed</th>
                <th className="pb-2 pr-4">Weight</th>
                <th className="pb-2 pr-4">Feed/Day</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((animal) => {
                const isEditing = editingId === animal._id;
                return (
                  <tr
                    key={animal._id}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="py-3 pr-4 font-semibold text-zinc-800">
                      {animal.identityNumberOrBatchName}
                      {animal.ringNumber && (
                        <span className="ml-1 text-xs text-zinc-400">
                          (R:{animal.ringNumber})
                        </span>
                      )}
                    </td>
                    {!isPoultry && (
                      <td className="py-3 pr-4 text-zinc-600">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                            className={INPUT_CLASS}
                          />
                        ) : (
                          animal.name || "-"
                        )}
                      </td>
                    )}
                    <td className="py-3 pr-4 text-zinc-600">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editBreed}
                          onChange={(e) => setEditBreed(e.target.value)}
                          className={INPUT_CLASS}
                        />
                      ) : (
                        animal.breed
                      )}
                    </td>
                    <td className="py-3 pr-4 text-zinc-600">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={editWeight}
                          onChange={(e) => setEditWeight(e.target.value)}
                          className={INPUT_CLASS}
                        />
                      ) : (
                        `${animal.entryWeight} kg`
                      )}
                    </td>
                    <td className="py-3 pr-4 text-zinc-600">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={editFeed}
                          onChange={(e) => setEditFeed(e.target.value)}
                          className={INPUT_CLASS}
                        />
                      ) : (
                        `${animal.averageFeedKg} kg`
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {isEditing ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className={INPUT_CLASS}
                        >
                          <option value="healthy">Healthy</option>
                          <option value="sick">Sick</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                            STATUS_STYLE[animal.status] ||
                            "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {animal.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => saveEdit(animal._id)}
                            disabled={isSaving}
                            className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(animal)}
                            className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(animal._id)}
                            className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
