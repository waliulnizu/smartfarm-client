"use client";

import Link from "next/link";

const CATEGORIES = [
  { emoji: "\uD83D\uDC04", title: "Cows", desc: "Milch cows, oxen, heifers, and calves", color: "bg-emerald-100 text-emerald-700", href: "/explore?type=Cow" },
  { emoji: "\uD83D\uDC10", title: "Goats", desc: "Bucks, does, and kids", color: "bg-amber-100 text-amber-700", href: "/explore?type=Goat" },
  { emoji: "\uD83D\uDC14", title: "Hens", desc: "Layers, broilers, cocks, and desi", color: "bg-rose-100 text-rose-700", href: "/explore?type=Hen" },
  { emoji: "\uD83E\uDD86", title: "Ducks", desc: "Pekin, runner, muscovy, and khaki", color: "bg-sky-100 text-sky-700", href: "/explore?type=Duck" },
];

export default function CategoriesSection() {
  return (
    <section id="categories" className="bg-zinc-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Animal Categories</h2>
          <p className="mt-3 text-lg text-zinc-500">Comprehensive tracking for every type of livestock</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c.title} href={c.href} className="rounded-2xl border border-zinc-200 bg-white p-6 text-center transition hover:shadow-md">
              <span className="text-5xl">{c.emoji}</span>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">{c.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{c.desc}</p>
              <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${c.color}`}>Browse {c.title}</span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/explore" className="inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            View All Animals
          </Link>
        </div>
      </div>
    </section>
  );
}
