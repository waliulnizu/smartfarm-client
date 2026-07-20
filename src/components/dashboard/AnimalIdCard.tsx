"use client";

import { AnimalType } from "@/context/AnimalTypeContext";

interface AnimalIdCardProps {
  type: AnimalType;
  identityNumber: string;
  name?: string;
  ringNumber?: string;
}

export default function AnimalIdCard({
  type,
  identityNumber,
  name,
  ringNumber,
}: AnimalIdCardProps) {
  const isPoultry = type === "Hen" || type === "Duck";

  if (isPoultry) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-sky-300 bg-sky-50 px-4 py-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
          R
        </div>
        <span className="text-xs font-medium text-sky-700">
          Ring: {ringNumber || "N/A"}
        </span>
        <span className="text-xs text-sky-400">|</span>
        <span className="text-xs font-semibold text-sky-800">
          {identityNumber}
        </span>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <div className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-yellow-400" />
      <div className="rounded-lg border-2 border-yellow-300 bg-yellow-50 px-4 py-2 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-yellow-500 text-xs font-bold text-white">
            TAG
          </div>
          <div>
            <p className="text-sm font-bold text-yellow-800">
              {identityNumber}
            </p>
            {name && (
              <p className="text-xs text-yellow-600">{name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
