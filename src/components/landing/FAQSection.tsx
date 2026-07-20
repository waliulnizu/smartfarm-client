"use client";

import { useState } from "react";

const FAQS = [
  { q: "How do I add a new cow to the system?", a: "Go to Dashboard > Add Animal. Fill in the breed, weight, feed amount, and optionally gender, category, and pregnancy status. The system auto-generates a unique neck-tag ID." },
  { q: "Can I track milk production per cow?", a: "Yes. Each daily log entry includes milk collected liters. The system aggregates this for per-cow milk production reports and ROI calculations." },
  { q: "How do vaccine alerts work?", a: "When you log a vaccine via the Medical Log, you set a next dose date. The system sends alerts for overdue, tomorrow, and upcoming vaccines within a 2-day window." },
  { q: "Is my farm data secure?", a: "Absolutely. All data is encrypted in transit via HTTPS. Authentication uses JWT access + refresh tokens. Role-based access controls protect sensitive financial data." },
  { q: "Can multiple users manage the same farm?", a: "Yes. Admins can create Staff accounts. Staff can register animals and input daily logs, while only Admins can access valuation reports and user management." },
  { q: "What is the pricing?", a: "We offer a free tier for up to 10 animals. Paid plans start at \u09F3500/month for unlimited animals, advanced analytics, and priority support." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-zinc-50 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-3 text-lg text-zinc-500">Everything you need to know</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-6 py-4 text-left">
                <span className="font-medium text-zinc-900">{f.q}</span>
                <span className={`text-xl text-zinc-400 transition ${open === i ? "rotate-180" : ""}`}>{open === i ? "\u2212" : "+"}</span>
              </button>
              {open === i && <div className="px-6 pb-4 text-sm leading-relaxed text-zinc-500">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
