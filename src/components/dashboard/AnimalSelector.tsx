"use client";

import { useAnimalType, AnimalType, ANIMAL_THEMES } from "@/context/AnimalTypeContext";

const ANIMALS = ["Cow", "Goat", "Hen", "Duck"] as const;

const SELECT_COLORS: Record<AnimalType, string> = {
  Cow: "border-emerald-400 bg-emerald-50 text-emerald-800 focus:ring-emerald-300",
  Goat: "border-amber-400 bg-amber-50 text-amber-800 focus:ring-amber-300",
  Hen: "border-yellow-400 bg-yellow-50 text-yellow-800 focus:ring-yellow-300",
  Duck: "border-sky-400 bg-sky-50 text-sky-800 focus:ring-sky-300",
};

export default function AnimalSelector() {
  const { selectedType, setSelectedType } = useAnimalType();
  const theme = ANIMAL_THEMES[selectedType];

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-zinc-600">Animal:</label>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value as AnimalType)}
        className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 ${SELECT_COLORS[selectedType]}`}
      >
        {ANIMALS.map((animal) => (
          <option key={animal} value={animal}>
            {ANIMAL_THEMES[animal].emoji} {animal}
          </option>
        ))}
      </select>
      <span className="hidden text-xs text-zinc-400 sm:inline">
        {theme.description}
      </span>
    </div>
  );
}
