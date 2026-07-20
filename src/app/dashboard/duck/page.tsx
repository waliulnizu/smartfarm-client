"use client";

import { useAnimalType } from "@/context/AnimalTypeContext";
import { useEffect } from "react";
import AnimalPage from "@/components/dashboard/AnimalPage";

export default function DuckPage() {
  const { setSelectedType } = useAnimalType();
  useEffect(() => { setSelectedType("Duck"); }, [setSelectedType]);
  return <AnimalPage animalType="Duck" />;
}
