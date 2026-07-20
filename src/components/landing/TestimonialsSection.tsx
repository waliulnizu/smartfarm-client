"use client";

const TESTIMONIALS = [
  { name: "Abdul Rahman", role: "Dairy Farmer, Rangpur", avatar: "\uD83D\uDC68\u200D\uD83C\uDF3E", quote: "SmartKhamar helped me track 25 cows effortlessly. The vaccine alerts alone saved me from losing two calves." },
  { name: "Fatima Begum", role: "Farm Owner, Sylhet", avatar: "\uD83D\uDC69\u200D\uD83C\uDF3E", quote: "The ROI feature showed me which animals are profitable. I increased my monthly income by 40% in 3 months." },
  { name: "Karim Uddin", role: "Livestock Consultant", avatar: "\uD83D\uDC68\u200D\u2695\uFE0F", quote: "I recommend SmartKhamar to all my clients. The weight tracking and health logs work for cows, goats, and poultry alike." },
  { name: "Shahida Parvin", role: "Co-operative Manager, Bogura", avatar: "\uD83D\uDC69\u200D\uD83D\uDCBC", quote: "Managing 100+ animals across 5 farms is now possible with a single dashboard. A game changer for cooperatives." },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Trusted by Farmers Across Bangladesh</h2>
          <p className="mt-3 text-lg text-zinc-500">Real stories from real farmers</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{t.avatar}</span>
                <div>
                  <div className="font-semibold text-zinc-900">{t.name}</div>
                  <div className="text-sm text-zinc-500">{t.role}</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 italic">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
