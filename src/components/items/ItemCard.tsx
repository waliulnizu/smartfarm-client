"use client";

import Link from "next/link";

interface AnimalCardProps {
  _id: string;
  type?: string;
  identityNumber: string;
  name?: string;
  breed: string;
  subType?: string;
  gender?: string;
  source?: string;
  originDistrict?: string;
  purchasePrice?: number;
  entryWeight: number;
  isPregnant?: boolean;
}

const TYPE_EMOJI: Record<string, { default: string; male: string; female: string; pregnant: string }> = {
  Cow: { default: "\uD83D\uDC04", male: "\uD83D\uDC02", female: "\uD83D\uDC04", pregnant: "\uD83D\uDC04\u200D\uD83E\uDDFC" },
  Goat: { default: "\uD83D\uDC10", male: "\uD83D\uDC10", female: "\uD83D\uDC10", pregnant: "\uD83D\uDC10" },
  Hen: { default: "\uD83D\uDC14", male: "\uD83D\uDC13", female: "\uD83D\uDC14", pregnant: "\uD83D\uDC14" },
  Duck: { default: "\uD83E\uDD86", male: "\uD83E\uDD86", female: "\uD83E\uDD86", pregnant: "\uD83E\uDD86" },
};

const TYPE_COLORS: Record<string, string> = {
  Cow: "from-emerald-100 to-emerald-50",
  Goat: "from-amber-100 to-amber-50",
  Hen: "from-rose-100 to-rose-50",
  Duck: "from-sky-100 to-sky-50",
};

const TYPE_LABEL: Record<string, string> = {
  Cow: "text-emerald-600",
  Goat: "text-amber-600",
  Hen: "text-rose-600",
  Duck: "text-sky-600",
};

function getEmoji(type: string, gender?: string, isPregnant?: boolean) {
  const t = TYPE_EMOJI[type] || TYPE_EMOJI.Cow;
  if (isPregnant) return t.pregnant;
  if (gender === "Male") return t.male;
  if (gender === "Female") return t.female;
  return t.default;
}

export default function ItemCard({ animal }: { animal: AnimalCardProps }) {
  const price = animal.purchasePrice ? `\u09F3${animal.purchasePrice.toLocaleString("en-BD")}` : "Farm Born";
  const emoji = getEmoji(animal.type || "Cow", animal.gender, animal.isPregnant);
  const gradient = TYPE_COLORS[animal.type || "Cow"] || TYPE_COLORS.Cow;
  const labelColor = TYPE_LABEL[animal.type || "Cow"] || TYPE_LABEL.Cow;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-lg">
      <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${gradient}`}>
        <span className="text-8xl transition group-hover:scale-110">{emoji}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider ${labelColor}`}>{animal.subType || animal.type || "Animal"}</span>
          {animal.isPregnant && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Pregnant</span>}
        </div>
        <h3 className="text-lg font-bold text-zinc-900">{animal.name || animal.identityNumber}</h3>
        <p className="mt-1 text-sm text-zinc-500">{animal.breed}</p>
        <div className="mt-3 space-y-1 text-xs text-zinc-400">
          <div className="flex justify-between"><span>Weight</span><span className="font-medium text-zinc-600">{animal.entryWeight} kg</span></div>
          {animal.originDistrict && <div className="flex justify-between"><span>Origin</span><span className="font-medium text-zinc-600">{animal.originDistrict}</span></div>}
          <div className="flex justify-between"><span>Price</span><span className="font-medium text-emerald-600">{price}</span></div>
        </div>
        <div className="mt-auto pt-4">
          <Link
            href={`/items/${animal._id}`}
            className="block w-full rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
