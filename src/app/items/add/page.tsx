"use client";

<<<<<<< HEAD
import { useState } from "react";
import { useRouter } from "next/navigation";
=======
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
>>>>>>> 8cfe7ef (Initial commit)
import { createAnimal } from "@/services/api";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

<<<<<<< HEAD
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
=======
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

const TYPE_COLORS: Record<AnimalType, { border: string; bg: string; text: string; ring: string }> = {
  Cow: { border: "border-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700", ring: "focus:ring-emerald-500" },
  Goat: { border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-700", ring: "focus:ring-amber-500" },
  Hen: { border: "border-rose-400", bg: "bg-rose-50", text: "text-rose-700", ring: "focus:ring-rose-500" },
  Duck: { border: "border-sky-400", bg: "bg-sky-50", text: "text-sky-700", ring: "focus:ring-sky-500" },
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
  const colors = TYPE_COLORS[type];

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  function switchType(t: AnimalType) {
    setType(t);
    setForm(defaultForm(t));
    setError("");
    setSuccess("");
  }
>>>>>>> 8cfe7ef (Initial commit)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await createAnimal({
<<<<<<< HEAD
        type: "Cow",
=======
        type,
>>>>>>> 8cfe7ef (Initial commit)
        identificationType: "neck-tag",
        identityNumberOrBatchName: form.identityNumberOrBatchName || `CUSTOM-${Date.now()}`,
        name: form.name || undefined,
        breed: form.breed,
<<<<<<< HEAD
        entryWeight: parseFloat(form.entryWeight),
=======
        entryWeight: parseFloat(form.entryWeight) || 0,
>>>>>>> 8cfe7ef (Initial commit)
        averageFeedKg: parseFloat(form.averageFeedKg) || 0,
        gender: form.gender as any,
        subType: form.subType,
        isPregnant: form.isPregnant,
        source: form.source as any,
        purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : undefined,
        originDistrict: form.originDistrict || undefined,
        status: "healthy",
      });
<<<<<<< HEAD
      setSuccess("Cow registered successfully!");
      setForm({ identityNumberOrBatchName: "", name: "", breed: "", entryWeight: "", averageFeedKg: "", gender: "Female", subType: "Milch Cow", isPregnant: false, source: "Outside Purchased", purchasePrice: "", originDistrict: "" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to register cow");
=======
      setSuccess(`${type} registered successfully!`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to register");
>>>>>>> 8cfe7ef (Initial commit)
    } finally {
      setIsSaving(false);
    }
  }

<<<<<<< HEAD
  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

=======
>>>>>>> 8cfe7ef (Initial commit)
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="pt-20">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
<<<<<<< HEAD
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
=======
          <h1 className="mb-1 text-3xl font-bold text-zinc-900">Add {type}</h1>
          <p className="mb-6 text-zinc-500">Register a new {type.toLowerCase()} in the system</p>

          <div className="mb-6 flex gap-2">
            {ANIMAL_TYPES.map((t) => {
              const isActive = t === type;
              const c = TYPE_COLORS[t];
              return (
                <button
                  key={t}
                  onClick={() => switchType(t)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                    isActive ? `${c.border} ${c.bg} ${c.text}` : "border-transparent text-zinc-500 hover:bg-zinc-100"
                  }`}
                >
                  <span>{TYPE_EMOJI[t]}</span>
                  <span>{t}</span>
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
>>>>>>> 8cfe7ef (Initial commit)
                </select>
              </div>
            </div>

<<<<<<< HEAD
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
=======
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

            <div className="flex items-center gap-3">
              {type !== "Hen" && type !== "Duck" && (
                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input type="checkbox" checked={form.isPregnant} onChange={(e) => update("isPregnant", e.target.checked)} className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                  Is Pregnant
                </label>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={isSaving} className="flex-1 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                {isSaving ? "Saving..." : `Register ${type}`}
              </button>
              <button type="button" onClick={() => router.push(`/items/manage?type=${type}`)} className="rounded-xl border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
                Cancel
              </button>
            </div>
>>>>>>> 8cfe7ef (Initial commit)
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
