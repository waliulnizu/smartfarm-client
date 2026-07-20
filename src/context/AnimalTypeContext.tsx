"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type AnimalType = "Cow" | "Goat" | "Hen" | "Duck";

export interface AnimalTheme {
  emoji: string;
  label: string;
  bgGradient: string;
  accent: string;
  accentLight: string;
  accentBorder: string;
  image: string;
  description: string;
  fields: string;
}

export const ANIMAL_THEMES: Record<AnimalType, AnimalTheme> = {
  Cow: {
    emoji: "\uD83D\uDC04",
    label: "Cow",
    bgGradient: "from-green-50 to-emerald-100",
    accent: "text-emerald-700",
    accentLight: "bg-emerald-50 border-emerald-200",
    accentBorder: "border-emerald-300",
    image: "/animals/cow.svg",
    description: "Individual tracking by asset number",
    fields: "Milk Production & Weight Tracker",
  },
  Goat: {
    emoji: "\uD83D\uDC10",
    label: "Goat",
    bgGradient: "from-orange-50 to-amber-100",
    accent: "text-amber-700",
    accentLight: "bg-amber-50 border-amber-200",
    accentBorder: "border-amber-300",
    image: "/animals/goat.svg",
    description: "Individual tracking by asset number",
    fields: "Milk Production & Weight Tracker",
  },
  Hen: {
    emoji: "\uD83D\uDC14",
    label: "Hen",
    bgGradient: "from-yellow-50 to-amber-50",
    accent: "text-yellow-700",
    accentLight: "bg-yellow-50 border-yellow-200",
    accentBorder: "border-yellow-300",
    image: "/animals/hen.svg",
    description: "Batch/Flock tracking by group name",
    fields: "Egg Collection & Batch Feed Intake",
  },
  Duck: {
    emoji: "\uD83E\uDD86",
    label: "Duck",
    bgGradient: "from-sky-50 to-blue-100",
    accent: "text-sky-700",
    accentLight: "bg-sky-50 border-sky-200",
    accentBorder: "border-sky-300",
    image: "/animals/duck.svg",
    description: "Batch/Flock tracking by group name",
    fields: "Egg Collection & Batch Feed Intake",
  },
};

interface AnimalTypeContextValue {
  selectedType: AnimalType;
  setSelectedType: (type: AnimalType) => void;
  theme: AnimalTheme;
}

const AnimalTypeContext = createContext<AnimalTypeContextValue | undefined>(
  undefined
);

export function AnimalTypeProvider({ children }: { children: ReactNode }) {
  const [selectedType, setSelectedType] = useState<AnimalType>("Cow");

  const value: AnimalTypeContextValue = {
    selectedType,
    setSelectedType,
    theme: ANIMAL_THEMES[selectedType],
  };

  return (
    <AnimalTypeContext.Provider value={value}>
      {children}
    </AnimalTypeContext.Provider>
  );
}

export function useAnimalType(): AnimalTypeContextValue {
  const context = useContext(AnimalTypeContext);
  if (!context) {
    throw new Error("useAnimalType must be used within an AnimalTypeProvider");
  }
  return context;
}
