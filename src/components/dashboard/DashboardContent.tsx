"use client";

import { useState, useCallback } from "react";
import { useAnimalType, AnimalType } from "@/context/AnimalTypeContext";
import CowPanel from "./CowPanel";
import GoatPanel from "./GoatPanel";
import HenPanel from "./HenPanel";
import DuckPanel from "./DuckPanel";
import WeightGrowthCard from "./WeightGrowthCard";
import AnimalRegistrationForm from "./AnimalRegistrationForm";
import VaccineAlertWidget from "./VaccineAlertWidget";
import AnimalSection from "./AnimalSection";

const PANEL_MAP: Record<AnimalType, React.ComponentType> = {
  Cow: CowPanel,
  Goat: GoatPanel,
  Hen: HenPanel,
  Duck: DuckPanel,
};

const SHOW_WEIGHT_GROWTH: AnimalType[] = ["Cow", "Goat"];

export default function DashboardContent() {
  const { selectedType, theme } = useAnimalType();
  const Panel = PANEL_MAP[selectedType];
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAnimalChange = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <section
      className={`rounded-2xl bg-gradient-to-br ${theme.bgGradient} p-6 transition-all duration-500`}
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 bg-white shadow-sm">
          <img
            src={theme.image}
            alt={selectedType}
            className="h-12 w-12 object-contain"
          />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${theme.accent}`}>
            {theme.emoji} {selectedType} Dashboard
          </h2>
          <p className="text-sm text-zinc-500">{theme.fields}</p>
        </div>
      </div>

      <div className="mb-6">
        <VaccineAlertWidget />
      </div>

      <Panel />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AnimalRegistrationForm onSuccess={handleAnimalChange} />

        {SHOW_WEIGHT_GROWTH.includes(selectedType) && (
          <WeightGrowthCard />
        )}
      </div>

      <div className="mt-6">
        <AnimalSection
          animalType={selectedType}
          refreshKey={refreshKey}
          onAnimalChange={handleAnimalChange}
        />
      </div>
    </section>
  );
}
