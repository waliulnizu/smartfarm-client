"use client";

import { useAnimalType } from "@/context/AnimalTypeContext";
import { useEffect } from "react";
import AnimalPage from "@/components/dashboard/AnimalPage";

export default function GoatPage() {
  const { setSelectedType } = useAnimalType();
  useEffect(() => { setSelectedType("Goat"); }, [setSelectedType]);
  return <AnimalPage animalType="Goat" />;
}
