"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createAnimal } from "@/services/api";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

type AnimalType = "Cow" | "Goat" | "Hen" | "Duck";

const TYPE_EMOJI: Record<AnimalType, string> = { Cow: "\uD83D\uDC04", Goat: "\uD83D\uDC10", Hen: "\uD83D\uDC14", Duck: "\uD83E\uDD86" };

const SUB_TYPES: Record<AnimalType, string[]> = {
  Cow: ["Milch Cow", "Ox", "Calf", "Heifer"],
  Goat: ["Buck", "Doe", "Kid"],
  Hen: ["Layer", "Broiler", "Cock", "Deshi Hen"],
  Duck: ["Pekin", "Indian Runner", "Muscovy", "Khaki Campbell"],
};

const GENDERS: Record<AnimalType, string[]> = {
  Cow: ["Male", "Female"],
  Goat: ["Male", "Female"],
  Hen: ["Male", "Female"],
  Duck: ["Male", "Female"],
};

const TYPE_COLORS: Record<AnimalType, { border: string; bg: string; text: string }> = {
  Cow: { border: "border-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700" },
  Goat: { border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-700" },
  Hen: { border: "border-rose-400", bg: "bg-rose-50", text: "text-rose-700" },
  Duck: { border: "border-sky-400", bg: "bg-sky-50", text: "text-sky-700" },
};

const ANIMAL_TYPES: AnimalType[] = ["Cow", "Goat", "Hen", "Duck"];

const defaultForm = (type: AnimalType) => ({
  identityNumberOrBatchName: "",
  name: "",
  breed: "",
  entryWeight: "",
  averageFeedKg: "",
  gender: GENDERS[type][0],
  subType: SUB_TYPES[type][0],
  isPregnant: false,
  source: "Outside Purchased",
  purchasePrice: "",
  originDistrict: "",
});

export default function AddAnimalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as AnimalType) || "Cow";
  const [type, setType] = useState<AnimalType>(initialType);
  const [form, setForm] = useState(defaultForm(initialType));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  function switchType(t: AnimalType) {
    setType(t);
    setForm(defaultForm(t));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await createAnimal({
        type,
        identificationType: "neck-tag",
        identityNumberOrBatchName: form.identityNumberOrBatchName || `CUSTOM-${Date.now()}`,
        name: form.name || undefined,
        breed: form.breed,
        entryWeight: parseFloat(form.entryWeight) || 0,
        averageFeedKg: parseFloat(form.averageFeedKg) || 0,
        gender: form.gender as any,
        subType: form.subType,
        isPregnant: form.isPregnant,
        source: form.source as any,
        purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : undefined,
        originDistrict: form.originDistrict || undefined,
        status: "healthy",
      });
      setSuccess(`${type} registered successfully!`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to register");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="pt-20">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <h1 className="mb-1 text-3xl font-bold text-zinc-900">Add {type}</h1>
          <p className="mb-6 text-zinc-500">Register a new {type.toLowerCase()} in the system</p>

          <div className="mb-6 flex gap-2">
            {ANIMAL_TYPES.map((t) => {
              const isActive = t === type;
              const c = TYPE_COLORS[t];
              return (
                <button key={t} onClick={() => switchType(t)} className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${isActive ? `${c.border} ${c.bg} ${c.text}` : "border-transparent text-zinc-500 hover:bg-zinc-100"}`}>
                  <span>{TYPE_EMOJI[t]}</span><span>{t}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
            {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
            {success && <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600">{success}</div>}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">ID / Batch Name</label>
                <input value={form.identityNumberOrBatchName} onChange={(e) => update("identityNumberOrBatchName", e.target.value)} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Name</label>
                <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Breed</label>
                <input value={form.breed} onChange={(e) => update("breed", e.target.value)} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Sub Type</label>
                <select value={form.subType} onChange={(e) => update("subType", e.target.value)} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  {SUB_TYPES[type].map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Gender</label>
                <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  {GENDERS[type].map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Source</label>
                <select value={form.source} onChange={(e) => update("source", e.target.value)} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  <option>Outside Purchased</option>
                  <option>Born on Farm</option>
                  <option>Gifted</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Entry Weight (kg)</label>
                <input type="number" step="0.1" value={form.entryWeight} onChange={(e) => update("entryWeight", e.target.value)} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Avg Feed (kg/day)</label>
                <input type="number" step="0.1" value={form.averageFeedKg} onChange={(e) => update("averageFeedKg", e.target.value)} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Purchase Price (Tk)</label>
                <input type="number" step="0.01" value={form.purchasePrice} onChange={(e) => update("purchasePrice", e.target.value)} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Origin District</label>
                <input value={form.originDistrict} onChange={(e) => update("originDistrict", e.target.value)} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </div>
            </div>

            {type !== "Hen" && type !== "Duck" && (
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" checked={form.isPregnant} onChange={(e) => update("isPregnant", e.target.checked)} className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                Is Pregnant
              </label>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={isSaving} className="flex-1 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                {isSaving ? "Saving..." : `Register ${type}`}
              </button>
              <button type="button" onClick={() => router.push(`/items/manage?type=${type}`)} className="rounded-xl border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
