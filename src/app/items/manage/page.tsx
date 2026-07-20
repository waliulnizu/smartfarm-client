"use client";

import { useState, useEffect } from "react";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
=======
import { useRouter, useSearchParams } from "next/navigation";
>>>>>>> 8cfe7ef (Initial commit)
import Link from "next/link";
import { getMyAnimals, deleteAnimal } from "@/services/api";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { SkeletonTable } from "@/components/dashboard/Skeleton";

<<<<<<< HEAD
export default function ManageCowsPage() {
  const router = useRouter();
  const [cows, setCows] = useState<any[]>([]);
=======
const ANIMAL_TYPES = ["Cow", "Goat", "Hen", "Duck"] as const;
const TYPE_EMOJI: Record<string, string> = { Cow: "\uD83D\uDC04", Goat: "\uD83D\uDC10", Hen: "\uD83D\uDC14", Duck: "\uD83E\uDD86" };

export default function ManageAnimalsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") || "Cow";
  const [animals, setAnimals] = useState<any[]>([]);
>>>>>>> 8cfe7ef (Initial commit)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { router.replace("/login"); return; }
    getMyAnimals().then((data) => {
<<<<<<< HEAD
      setCows(data.animals.filter((a: any) => a.type === "Cow"));
    }).catch(() => router.replace("/login")).finally(() => setIsLoading(false));
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this cow permanently?")) return;
    try {
      await deleteAnimal(id);
      setCows((prev) => prev.filter((c) => c._id !== id));
=======
      setAnimals(data.animals.filter((a: any) => a.type === activeType));
    }).catch(() => router.replace("/login")).finally(() => setIsLoading(false));
  }, [router, activeType]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this animal permanently?")) return;
    try {
      await deleteAnimal(id);
      setAnimals((prev) => prev.filter((c) => c._id !== id));
>>>>>>> 8cfe7ef (Initial commit)
    } catch { alert("Failed to delete"); }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="pt-20">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
<<<<<<< HEAD
              <h1 className="text-3xl font-bold text-zinc-900">My Cows</h1>
              <p className="text-zinc-500">Manage your registered cows</p>
            </div>
            <Link href="/items/add" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              + Add Cow
            </Link>
          </div>

          {isLoading ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm"><SkeletonTable rows={5} /></div>
          ) : cows.length === 0 ? (
            <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
              <span className="text-6xl">\uD83D\uDC04</span>
              <p className="mt-4 text-lg font-medium text-zinc-500">No cows registered yet</p>
              <Link href="/items/add" className="mt-4 inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                Register Your First Cow
=======
              <h1 className="text-3xl font-bold text-zinc-900">My {activeType}s</h1>
              <p className="text-zinc-500">Manage your registered {activeType.toLowerCase()}s</p>
            </div>
            <Link href={`/items/add?type=${activeType}`} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              + Add {activeType}
            </Link>
          </div>

          <div className="mb-6 flex gap-2">
            {ANIMAL_TYPES.map((t) => {
              const isActive = t === activeType;
              const colorMap: Record<string, string> = {
                Cow: "border-emerald-400 bg-emerald-50 text-emerald-700",
                Goat: "border-amber-400 bg-amber-50 text-amber-700",
                Hen: "border-rose-400 bg-rose-50 text-rose-700",
                Duck: "border-sky-400 bg-sky-50 text-sky-700",
              };
              const inactiveMap: Record<string, string> = {
                Cow: "border-transparent text-zinc-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600",
                Goat: "border-transparent text-zinc-500 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600",
                Hen: "border-transparent text-zinc-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600",
                Duck: "border-transparent text-zinc-500 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600",
              };
              return (
                <button
                  key={t}
                  onClick={() => router.push(`/items/manage?type=${t}`)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${isActive ? colorMap[t] : inactiveMap[t]}`}
                >
                  <span>{TYPE_EMOJI[t]}</span>
                  <span>{t}</span>
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm"><SkeletonTable rows={5} /></div>
          ) : animals.length === 0 ? (
            <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
              <span className="text-6xl">{TYPE_EMOJI[activeType]}</span>
              <p className="mt-4 text-lg font-medium text-zinc-500">No {activeType.toLowerCase()}s registered yet</p>
              <Link href={`/items/add?type=${activeType}`} className="mt-4 inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                Register Your First {activeType}
>>>>>>> 8cfe7ef (Initial commit)
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-xs font-medium uppercase text-zinc-500">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Breed</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Weight</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
<<<<<<< HEAD
                    {cows.map((cow) => (
                      <tr key={cow._id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                        <td className="px-4 py-3 font-semibold text-zinc-800">{cow.identityNumberOrBatchName}</td>
                        <td className="px-4 py-3 text-zinc-600">{cow.name || "-"}</td>
                        <td className="px-4 py-3 text-zinc-600">{cow.breed}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{cow.subType || "-"}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">{cow.entryWeight} kg</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cow.status === "healthy" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {cow.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/items/${cow._id}`} className="mr-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-100">
                            View
                          </Link>
                          <button onClick={() => handleDelete(cow._id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
=======
                    {animals.map((animal) => (
                      <tr key={animal._id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                        <td className="px-4 py-3 font-semibold text-zinc-800">{animal.identityNumberOrBatchName}</td>
                        <td className="px-4 py-3 text-zinc-600">{animal.name || "-"}</td>
                        <td className="px-4 py-3 text-zinc-600">{animal.breed}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{animal.subType || "-"}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">{animal.entryWeight} kg</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${animal.status === "healthy" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {animal.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/items/${animal._id}`} className="mr-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-100">
                            View
                          </Link>
                          <button onClick={() => handleDelete(animal._id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
>>>>>>> 8cfe7ef (Initial commit)
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
