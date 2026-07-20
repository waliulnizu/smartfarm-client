"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ItemCard from "@/components/items/ItemCard";
import { SkeletonBlock } from "@/components/dashboard/Skeleton";
import api from "@/services/api";

const ANIMAL_TYPES = [
  { value: "Cow", label: "Cow", emoji: "\uD83D\uDC04" },
  { value: "Goat", label: "Goat", emoji: "\uD83D\uDC10" },
  { value: "Hen", label: "Hen", emoji: "\uD83D\uDC14" },
  { value: "Duck", label: "Duck", emoji: "\uD83E\uDD86" },
];

const SUBTYPE_MAP: Record<string, string[]> = {
  Cow: ["Milch Cow", "Ox", "Heifer", "Calf"],
  Goat: ["Buck", "Doe", "Kid"],
  Hen: ["Layer", "Broiler", "Cock", "Deshi Hen"],
  Duck: ["Pekin", "Indian Runner", "Muscovy", "Khaki Campbell"],
};

const TITLE_MAP: Record<string, string> = {
  Cow: "Browse Cows",
  Goat: "Browse Goats",
  Hen: "Browse Hens",
  Duck: "Browse Ducks",
};

const DESC_MAP: Record<string, string> = {
  Cow: "Explore registered cattle from farms across Bangladesh",
  Goat: "Explore registered goats from farms across Bangladesh",
  Hen: "Explore registered poultry from farms across Bangladesh",
  Duck: "Explore registered ducks from farms across Bangladesh",
};

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "Cow";

  const [animals, setAnimals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState(initialType);
  const [subType, setSubType] = useState("all");
  const [gender, setGender] = useState("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = { type, page, limit: "12", sort };
      if (search) params.search = search;
      if (subType !== "all") params.subType = subType;
      if (gender !== "all") params.gender = gender;
      const { data } = await api.get("/public", { params });
      setAnimals(data.animals);
      setTotalPages(data.totalPages);
    } catch {
      setAnimals([]);
    } finally {
      setIsLoading(false);
    }
  }, [type, subType, gender, sort, search, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setSubType("all");
    setGender("all");
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const subTypes = SUBTYPE_MAP[type] || [];

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900">{TITLE_MAP[type] || "Browse Animals"}</h1>
            <p className="mt-1 text-zinc-500">{DESC_MAP[type]}</p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {ANIMAL_TYPES.map((t) => (
              <button key={t.value} onClick={() => handleTypeChange(t.value)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition ${type === t.value ? "bg-emerald-600 text-white shadow-md" : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"}`}>
                <span className="text-lg">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, name, or breed..."
                className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button type="submit" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">Search</button>
            </form>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1 rounded-xl border border-zinc-200 bg-white p-1">
              <button onClick={() => { setSubType("all"); setPage(1); }} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${subType === "all" ? "bg-emerald-100 text-emerald-800" : "text-zinc-500 hover:text-zinc-700"}`}>
                All
              </button>
              {subTypes.map((s) => (
                <button key={s} onClick={() => { setSubType(s); setPage(1); }} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${subType === s ? "bg-emerald-100 text-emerald-800" : "text-zinc-500 hover:text-zinc-700"}`}>
                  {s}
                </button>
              ))}
            </div>
            <select value={gender} onChange={(e) => { setGender(e.target.value); setPage(1); }} className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700">
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700">
              <option value="newest">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="weight_asc">Weight: Low</option>
              <option value="weight_desc">Weight: High</option>
              <option value="price_asc">Price: Low</option>
              <option value="price_desc">Price: High</option>
            </select>
            <span className="text-xs text-zinc-400">{animals.length} results</span>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <SkeletonBlock className="mb-4 h-40 w-full rounded-xl" />
                  <SkeletonBlock className="mb-2 h-4 w-3/4" />
                  <SkeletonBlock className="mb-2 h-3 w-1/2" />
                  <SkeletonBlock className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : animals.length === 0 ? (
            <div className="py-20 text-center">
              <span className="text-6xl">{"\uD83D\uDC3E"}</span>
              <p className="mt-4 text-lg font-medium text-zinc-500">No {type.toLowerCase()}s found</p>
              <p className="text-sm text-zinc-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {animals.map((a: any) => (
                <ItemCard key={a._id} animal={{
                  _id: a._id,
                  type: a.type,
                  identityNumber: a.identityNumberOrBatchName,
                  name: a.name,
                  breed: a.breed,
                  subType: a.subType,
                  gender: a.gender,
                  source: a.source,
                  originDistrict: a.originDistrict,
                  purchasePrice: a.purchasePrice,
                  entryWeight: a.entryWeight,
                  isPregnant: a.isPregnant,
                }} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-40">
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`rounded-xl px-4 py-2 text-sm font-medium ${page === i + 1 ? "bg-emerald-600 text-white" : "border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 disabled:opacity-40">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
