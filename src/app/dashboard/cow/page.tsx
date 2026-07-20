"use client";

import { useAnimalType, AnimalType } from "@/context/AnimalTypeContext";
import { useEffect } from "react";
import AnimalPage from "@/components/dashboard/AnimalPage";

export default function CowPage() {
  const { setSelectedType } = useAnimalType();
  useEffect(() => { setSelectedType("Cow"); }, [setSelectedType]);
  return <AnimalPage animalType="Cow" />;
}
