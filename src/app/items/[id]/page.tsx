"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { SkeletonBlock } from "@/components/dashboard/Skeleton";
import api from "@/services/api";

export default function CowDetailPage() {
  const { id } = useParams();
  const [animal, setAnimal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/public/${id}`)
      .then(({ data }) => setAnimal(data.animal))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-50 pt-20"><div className="mx-auto max-w-4xl px-4 py-8"><SkeletonBlock className="mb-4 h-8 w-64" /><SkeletonBlock className="mb-6 h-64 w-full rounded-2xl" /><SkeletonBlock className="h-4 w-full" /></div></div>;
  }

  if (!animal) {
    return <div className="min-h-screen bg-zinc-50 pt-20"><div className="mx-auto max-w-4xl px-4 py-20 text-center"><span className="text-6xl">\uD83D\uDC04</span><p className="mt-4 text-lg text-zinc-500">Cow not found</p><Link href="/explore" className="mt-4 inline-block text-emerald-600 hover:underline">Browse all cows</Link></div></div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="pt-20">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <Link href="/explore" className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-emerald-600">&larr; Back to Explore</Link>

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="flex h-64 items-center justify-center bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-50 sm:h-80">
              <span className="text-9xl">{animal.isPregnant ? "\uD83D\uDC04\u200D\uD83E\uDDFC" : animal.gender === "Male" ? "\uD83D\uDC02" : "\uD83D\uDC04"}</span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-zinc-900">{animal.name || animal.identityNumberOrBatchName}</h1>
                    {animal.isPregnant && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Pregnant</span>}
                  </div>
                  <p className="mt-1 text-lg text-zinc-500">{animal.breed} &middot; {animal.identityNumberOrBatchName}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-6 py-3 text-center">
                  <p className="text-xs text-emerald-600">Entry Weight</p>
                  <p className="text-2xl font-bold text-emerald-700">{animal.entryWeight} kg</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium text-zinc-400">Gender</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-800">{animal.gender || "N/A"}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium text-zinc-400">Category</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-800">{animal.subType || "N/A"}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium text-zinc-400">Source</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-800">{animal.source || "N/A"}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium text-zinc-400">Origin District</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-800">{animal.originDistrict || "N/A"}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium text-zinc-400">Purchase Price</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">{animal.purchasePrice ? `\u09F3${animal.purchasePrice.toLocaleString("en-BD")}` : "Farm Born"}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium text-zinc-400">Entry Date</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-800">{new Date(animal.entryDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-zinc-900">Description</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  This {animal.subType?.toLowerCase() || "cow"} is a {animal.breed} breed registered under ID <strong>{animal.identityNumberOrBatchName}</strong>.
                  {animal.name ? ` Named "${animal.name}", ` : " "}it weighed <strong>{animal.entryWeight} kg</strong> at entry.
                  {animal.source === "Farm Born" ? " It was born and raised on the farm." : ` It was purchased from ${animal.originDistrict || "outside"} for \u09F3${(animal.purchasePrice || 0).toLocaleString("en-BD")}.`}
                  {animal.isPregnant ? " The cow is currently pregnant." : ""}
                  {animal.calvingCount > 0 ? ` It has had ${animal.calvingCount} previous calving(s).` : ""}
                </p>
              </div>

              <div className="mt-8 border-t border-zinc-200 pt-6">
                <Link href="/explore" className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                  &larr; Back to Explore
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
