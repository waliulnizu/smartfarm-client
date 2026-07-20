"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAnimal } from "@/services/api";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function AddCowPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    identityNumberOrBatchName: "",
    name: "",
    breed: "",
    entryWeight: "",
    averageFeedKg: "",
    gender: "Female",
    subType: "Milch Cow",
    isPregnant: false,
    source: "Outside Purchased",
    purchasePrice: "",
    originDistrict: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await createAnimal({
        type: "Cow",
        identificationType: "neck-tag",
        identityNumberOrBatchName: form.identityNumberOrBatchName || `CUSTOM-${Date.now()}`,
        name: form.name || undefined,
        breed: form.breed,
        entryWeight: parseFloat(form.entryWeight),
        averageFeedKg: parseFloat(form.averageFeedKg) || 0,
        gender: form.gender as any,
        subType: form.subType,
        isPregnant: form.isPregnant,
        source: form.source as any,
        purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : undefined,
        originDistrict: form.originDistrict || undefined,
        status: "healthy",
      });
      setSuccess("Cow registered successfully!");
      setForm({ identityNumberOrBatchName: "", name: "", breed: "", entryWeight: "", averageFeedKg: "", gender: "Female", subType: "Milch Cow", isPregnant: false, source: "Outside Purchased", purchasePrice: "", originDistrict: "" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to register cow");
    } finally {
      setIsSaving(false);
    }
  }

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="pt-20">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <h1 className="text-3xl font-bold text-zinc-900">Register a New Cow</h1>
          <p className="mt-1 text-zinc-500">Add a new cow to your farm records</p>

          {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}
          {success && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{success}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">ID / Batch Name</label>
                <input type="text" value={form.identityNumberOrBatchName} onChange={(e) => update("identityNumberOrBatchName", e.target.value)} placeholder="Auto or custom ID" className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Name</label>
                <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Lalghoda" className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Breed *</label>
              <input type="text" required value={form.breed} onChange={(e) => update("breed", e.target.value)} placeholder="e.g. Holstein Friesian" className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Entry Weight (kg) *</label>
                <input type="number" required min="1" value={form.entryWeight} onChange={(e) => update("entryWeight", e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Daily Feed (kg)</label>
                <input type="number" min="0" step="0.1" value={form.averageFeedKg} onChange={(e) => update("averageFeedKg", e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Gender</label>
                <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Category</label>
                <select value={form.subType} onChange={(e) => update("subType", e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900">
                  <option value="Milch Cow">Milch Cow</option>
                  <option value="Ox">Ox</option>
                  <option value="Heifer">Heifer</option>
                  <option value="Calf">Calf</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Source</label>
                <select value={form.source} onChange={(e) => update("source", e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900">
                  <option value="Outside Purchased">Outside Purchased</option>
                  <option value="Farm Born">Farm Born</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Purchase Price (BDT)</label>
                <input type="number" min="0" value={form.purchasePrice} onChange={(e) => update("purchasePrice", e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">Origin District</label>
                <input type="text" value={form.originDistrict} onChange={(e) => update("originDistrict", e.target.value)} placeholder="e.g. Rangpur" className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.isPregnant} onChange={(e) => update("isPregnant", e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm font-medium text-zinc-700">Pregnant</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={isSaving} className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-400">
              {isSaving ? "Registering..." : "Register Cow"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
