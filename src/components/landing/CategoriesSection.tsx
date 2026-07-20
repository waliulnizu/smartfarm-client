"use client";

import Link from "next/link";

const CATEGORIES = [
  { emoji: "\uD83E\uDDB0", title: "Milch Cows", desc: "Lactating dairy cows with milk production tracking", count: "High-yield breeds" },
  { emoji: "\uD83D\uDC04", title: "Oxen", desc: "Adult male cattle for draft or meat purposes", count: "Strong stock" },
  { emoji: "\uD83D\uDC07", title: "Heifers", desc: "Young female cows before first calving", count: "Future milkers" },
  { emoji: "\uD83D\uDC3E", title: "Calves", desc: "Newborn and young cattle up to weaning", count: "Growing herd" },
];

export default function CategoriesSection() {
  return (
    <section id="categories" className="bg-zinc-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Cow Categories</h2>
          <p className="mt-3 text-lg text-zinc-500">Comprehensive tracking for every type of cattle</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <div key={c.title} className="rounded-2xl border border-zinc-200 bg-white p-6 text-center transition hover:shadow-md">
              <span className="text-5xl">{c.emoji}</span>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">{c.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{c.desc}</p>
              <span className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">{c.count}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/explore" className="inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            View All Cows
          </Link>
        </div>
      </div>
    </section>
  );
}
