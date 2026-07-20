"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-8 py-14 text-center shadow-xl sm:px-14">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Transform Your Farm?</h2>
        <p className="mt-4 text-lg text-emerald-100">Join 500+ farmers who are already using SmartKhamar to manage their cattle smarter.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/register" className="rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-emerald-700 shadow hover:bg-emerald-50">
            Get Started Free
          </Link>
          <Link href="/contact" className="rounded-xl border-2 border-white/50 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
            Talk to Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
