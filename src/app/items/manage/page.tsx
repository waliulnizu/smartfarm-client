"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyAnimals, deleteAnimal } from "@/services/api";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { SkeletonTable } from "@/components/dashboard/Skeleton";

export default function ManageCowsPage() {
  const router = useRouter();
  const [cows, setCows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { router.replace("/login"); return; }
    getMyAnimals().then((data) => {
      setCows(data.animals.filter((a: any) => a.type === "Cow"));
    }).catch(() => router.replace("/login")).finally(() => setIsLoading(false));
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this cow permanently?")) return;
    try {
      await deleteAnimal(id);
      setCows((prev) => prev.filter((c) => c._id !== id));
    } catch { alert("Failed to delete"); }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="pt-20">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
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
