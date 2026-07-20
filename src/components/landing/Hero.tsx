"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const SLIDES = [
  { emoji: "\uD83D\uDC04", title: "Smart Cow Management", subtitle: "Track every cow from birth to market with AI-powered insights" },
  { emoji: "\uD83E\uDDBE", title: "Health Monitoring", subtitle: "Real-time vaccine alerts, weight tracking, and health records" },
  { emoji: "\uD83D\uDCCA", title: "Profit Analytics", subtitle: "Per-cow ROI, milk production analysis, and cost tracking" },
];

export default function Hero() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const current = SLIDES[slide];

  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 pt-20">
      <div className="absolute inset-0 bg-[url('/animals/cow.svg')] bg-repeat opacity-5" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:py-28">
        <div className="mb-8 text-8xl transition-all duration-500">{current.emoji}</div>
        <h1 className="mb-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {current.title}
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-emerald-100/80">
          {current.subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register" className="rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-emerald-800 shadow-lg transition hover:bg-emerald-50">
            Start Free Trial
          </Link>
          <Link href="/explore" className="rounded-xl border-2 border-emerald-400/50 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-700/50">
            Browse Cows
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} className={`h-2 w-2 rounded-full transition ${i === slide ? "bg-white w-6" : "bg-white/40"}`} />
        ))}
      </div>
    </section>
  );
}
