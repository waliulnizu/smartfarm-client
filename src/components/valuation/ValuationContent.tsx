"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllAnimalsROI,
  getAnimalROI,
  getMe,
  AnimalROIItem,
  AnimalROIDetailResponse,
} from "@/services/api";
import { SkeletonTable, SkeletonBlock } from "@/components/dashboard/Skeleton";

const BDT = (n: number) => `\u09F3${n.toLocaleString("en-BD")}`;

const TYPE_BADGE: Record<string, string> = {
  Cow: "bg-emerald-100 text-emerald-700",
  Goat: "bg-amber-100 text-amber-700",
  Hen: "bg-yellow-100 text-yellow-700",
  Duck: "bg-sky-100 text-sky-700",
};

export default function ValuationContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [animals, setAnimals] = useState<AnimalROIItem[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalROIDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    getMe()
      .then((u) => {
        if (u.role !== "Admin") {
          router.replace("/dashboard/cow");
          return;
        }
        setAuthorized(true);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const data = await getAllAnimalsROI();
        if (!cancelled) setAnimals(data.animals);
      } catch {
        if (!cancelled) setAnimals([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [authorized]);

  const filtered = animals.filter((a) => {
    if (filterType !== "all" && a.type !== filterType) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.identityNumber.toLowerCase().includes(q) ||
      (a.name && a.name.toLowerCase().includes(q)) ||
      a.breed.toLowerCase().includes(q)
    );
  });

  const totalIncome = filtered.reduce((s, a) => s + a.totalIncome, 0);
  const totalExpenses = filtered.reduce((s, a) => s + a.totalExpenses, 0);
  const totalProfit = filtered.reduce((s, a) => s + a.netProfit, 0);

  async function openDetail(animalId: string) {
    setDetailLoading(true);
    setSelectedAnimal(null);
    try {
      const data = await getAnimalROI(animalId);
      setSelectedAnimal(data);
    } catch {
      // ignore
    } finally {
      setDetailLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <SkeletonBlock className="mb-6 h-8 w-64" />
        <SkeletonTable rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Asset & Valuation</h1>
        <p className="text-sm text-zinc-500">Per-animal ROI, income, and pregnancy history</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase text-zinc-500">Total Income</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">{BDT(totalIncome)}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase text-zinc-500">Total Expenses</p>
          <p className="mt-1 text-xl font-bold text-red-600">{BDT(totalExpenses)}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase text-zinc-500">Net Profit</p>
          <p className={`mt-1 text-xl font-bold ${totalProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {totalProfit >= 0 ? "+" : ""}{BDT(totalProfit)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ID, name, breed..."
          className="w-64 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="Cow">Cow</option>
          <option value="Goat">Goat</option>
          <option value="Hen">Hen</option>
          <option value="Duck">Duck</option>
        </select>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-medium uppercase text-zinc-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Breed</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3 text-right">Weight</th>
                <th className="px-4 py-3 text-right">Income</th>
                <th className="px-4 py-3 text-right">Expenses</th>
                <th className="px-4 py-3 text-right">Profit/Loss</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-zinc-400">
                    No animals found
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a._id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <td className="px-4 py-3 font-semibold text-zinc-800">{a.identityNumber}</td>
                    <td className="px-4 py-3 text-zinc-600">{a.name || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_BADGE[a.type] || "bg-zinc-100 text-zinc-600"}`}>
                        {a.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{a.breed}</td>
                    <td className="px-4 py-3 text-zinc-600">{a.source || "-"}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{a.latestWeight} kg</td>
                    <td className="px-4 py-3 text-right text-emerald-600">{BDT(a.totalIncome)}</td>
                    <td className="px-4 py-3 text-right text-red-600">{BDT(a.totalExpenses)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${a.isProfit ? "text-emerald-600" : "text-red-600"}`}>
                      {a.netProfit >= 0 ? "+" : ""}{BDT(a.netProfit)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openDetail(a._id)}
                        className="rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-100"
                      >
                        ROI Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(selectedAnimal || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedAnimal(null)}>
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            {detailLoading ? (
              <div className="space-y-4">
                <SkeletonBlock className="h-6 w-48" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-3/4" />
              </div>
            ) : selectedAnimal && (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900">
                      {selectedAnimal.animal.identityNumberOrBatchName}
                      {selectedAnimal.animal.name && (
                        <span className="ml-2 text-sm font-normal text-zinc-500">({selectedAnimal.animal.name})</span>
                      )}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {selectedAnimal.animal.type} &middot; {selectedAnimal.animal.breed} &middot; {selectedAnimal.animal.source}
                    </p>
                  </div>
                  <button onClick={() => setSelectedAnimal(null)} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-200">
                    Close
                  </button>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-xs font-medium text-emerald-600">Total Income</p>
                    <p className="text-lg font-bold text-emerald-700">{BDT(selectedAnimal.income.totalIncome)}</p>
                  </div>
                  <div className="rounded-lg bg-red-50 p-3">
                    <p className="text-xs font-medium text-red-600">Total Expenses</p>
                    <p className="text-lg font-bold text-red-700">{BDT(selectedAnimal.expenses.totalExpenses)}</p>
                  </div>
                </div>

                <div className={`mb-4 rounded-lg p-3 ${selectedAnimal.profit.isProfit ? "bg-emerald-50" : "bg-red-50"}`}>
                  <p className={`text-xs font-medium ${selectedAnimal.profit.isProfit ? "text-emerald-600" : "text-red-600"}`}>
                    Net Profit / Loss
                  </p>
                  <p className={`text-lg font-bold ${selectedAnimal.profit.isProfit ? "text-emerald-700" : "text-red-700"}`}>
                    {selectedAnimal.profit.netProfit >= 0 ? "+" : ""}{BDT(selectedAnimal.profit.netProfit)}
                    <span className="ml-2 text-sm font-normal">({selectedAnimal.profit.roi}% ROI)</span>
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-semibold text-zinc-700">Income Breakdown</h3>
                  <div className="rounded-lg bg-zinc-50 p-3 text-sm">
                    <div className="flex justify-between"><span className="text-zinc-600">Milk ({selectedAnimal.income.totalMilkLiters.toFixed(1)}L &times; {BDT(selectedAnimal.income.milkPricePerLiter)})</span><span className="font-medium text-zinc-800">{BDT(selectedAnimal.income.milkIncome)}</span></div>
                    <div className="flex justify-between mt-1"><span className="text-zinc-600">Asset Value ({selectedAnimal.income.latestWeight}kg)</span><span className="font-medium text-zinc-800">{BDT(selectedAnimal.income.assetValue)}</span></div>
                  </div>
                </div>

                {selectedAnimal.expenses.breakdown.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-zinc-700">Expense Breakdown</h3>
                    <div className="rounded-lg bg-zinc-50 p-3 text-sm">
                      {selectedAnimal.expenses.breakdown.map((b, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-zinc-600">{b.category}</span>
                          <span className="font-medium text-zinc-800">{BDT(b.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-semibold text-zinc-700">Pregnancy History</h3>
                  <div className="rounded-lg bg-zinc-50 p-3 text-sm">
                    {selectedAnimal.pregnancy.isActive ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Pregnant</span>
                        {selectedAnimal.pregnancy.activePregnancy && (
                          <span className="text-zinc-600">
                            Due: {new Date(selectedAnimal.pregnancy.activePregnancy.expectedDeliveryDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-zinc-500">Not currently pregnant</p>
                    )}
                    {selectedAnimal.pregnancy.completedCount > 0 && (
                      <p className="mt-2 text-zinc-600">{selectedAnimal.pregnancy.completedCount} completed pregnancy(ies)</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span>Logs: {selectedAnimal.logCount}</span>
                  {selectedAnimal.lastLogDate && <span>Last log: {new Date(selectedAnimal.lastLogDate).toLocaleDateString()}</span>}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
