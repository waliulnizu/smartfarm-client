"use client";

export default function NewsletterSection() {
  return (
    <section className="bg-gradient-to-r from-emerald-700 to-emerald-600 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-white">Stay Updated with Farming Tips</h2>
        <p className="mt-3 text-emerald-100">Get weekly AI-driven insights about livestock health, market prices, and best practices.</p>
        <div className="mt-8 flex max-w-md mx-auto gap-3">
          <input type="email" placeholder="Enter your email" className="flex-1 rounded-xl border-0 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
          <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Subscribe</button>
        </div>
      </div>
    </section>
  );
}
