"use client";

import { useAnimalType } from "@/context/AnimalTypeContext";
import { useEffect } from "react";
import AnimalPage from "@/components/dashboard/AnimalPage";

export default function HenPage() {
  const { setSelectedType } = useAnimalType();
  useEffect(() => { setSelectedType("Hen"); }, [setSelectedType]);
  return <AnimalPage animalType="Hen" />;
}
