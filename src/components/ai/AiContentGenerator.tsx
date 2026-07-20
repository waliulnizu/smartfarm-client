"use client";

import { useState } from "react";
import api from "@/services/api";

export default function AiContentGenerator() {
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("Female");
  const [subType, setSubType] = useState("Milch Cow");
  const [weight, setWeight] = useState("");
  const [source, setSource] = useState("Outside Purchased");
  const [originDistrict, setOriginDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    if (!breed || !weight) return;
    setIsLoading(true);
    setDescription("");
    try {
      const { data } = await api.post("/ai/describe", { breed, gender, subType, weight: parseFloat(weight), source, originDistrict });
      setDescription(data.description);
    } catch {
      setDescription("Failed to generate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const suggestion = "This cow is a healthy and productive animal. It belongs to a well-known breed suitable for Bangladesh's climate. With proper care and nutrition, it can provide excellent yield and growth performance.";

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">{"\uD83E\uDD16"}</span>
        <h3 className="text-lg font-semibold text-zinc-900">AI Cow Description Generator</h3>
      </div>
      <p className="mb-4 text-sm text-zinc-500">Generate a professional description for your cow listing using AI.</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Breed *</label>
          <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="e.g. Holstein Friesian" className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Weight (kg) *</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900">
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Category</label>
          <select value={subType} onChange={(e) => setSubType(e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900">
            <option value="Milch Cow">Milch Cow</option>
            <option value="Ox">Ox</option>
            <option value="Heifer">Heifer</option>
            <option value="Calf">Calf</option>
          </select>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={isLoading || !breed || !weight} className="mt-4 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-300">
        {isLoading ? "Generating..." : "Generate Description"}
      </button>

      {(description || isLoading) && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-4">
          <p className="text-xs font-medium text-emerald-700">AI-Generated Description</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            {isLoading ? "Writing description..." : description}
          </p>
        </div>
      )}

      {!description && !isLoading && (
        <div className="mt-4 rounded-xl bg-zinc-50 p-4">
          <p className="text-xs font-medium text-zinc-400">Sample Output</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 italic">{suggestion}</p>
        </div>
      )}
    </div>
  );
}
