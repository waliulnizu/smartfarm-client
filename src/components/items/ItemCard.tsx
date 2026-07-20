"use client";

import Link from "next/link";

interface CowCardProps {
  _id: string;
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
  image?: string;
}

export default function ItemCard({ cow }: { cow: CowCardProps }) {
  const price = cow.purchasePrice ? `\u09F3${cow.purchasePrice.toLocaleString("en-BD")}` : "Farm Born";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-lg">
      <div className="flex h-48 items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50">
        <span className="text-8xl transition group-hover:scale-110">{cow.isPregnant ? "\uD83D\uDC04\u200D\uD83E\uDDFC" : cow.gender === "Male" ? "\uD83D\uDC02" : "\uD83D\uDC04"}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">{cow.subType || cow.gender || "Cow"}</span>
          {cow.isPregnant && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Pregnant</span>}
        </div>
        <h3 className="text-lg font-bold text-zinc-900">{cow.name || cow.identityNumber}</h3>
        <p className="mt-1 text-sm text-zinc-500">{cow.breed}</p>
        <div className="mt-3 space-y-1 text-xs text-zinc-400">
          <div className="flex justify-between"><span>Weight</span><span className="font-medium text-zinc-600">{cow.entryWeight} kg</span></div>
          {cow.originDistrict && <div className="flex justify-between"><span>Origin</span><span className="font-medium text-zinc-600">{cow.originDistrict}</span></div>}
          <div className="flex justify-between"><span>Price</span><span className="font-medium text-emerald-600">{price}</span></div>
        </div>
        <div className="mt-auto pt-4">
          <Link
            href={`/items/${cow._id}`}
            className="block w-full rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
