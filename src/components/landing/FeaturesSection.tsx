"use client";

const FEATURES = [
  { icon: "\uD83D\uDC04", title: "Individual Cow Tracking", desc: "Track each cow by neck-tag ID with breed, weight, health status, and pregnancy history." },
  { icon: "\uD83E\uDDD1\u200D\u2696\uFE0F", title: "Daily Log System", desc: "Log feed intake, milk yield, weight, health notes, and medicine for every cow daily." },
  { icon: "\uD83D\uDC89", title: "Vaccine Scheduler", desc: "Automated vaccine alerts with overdue, tomorrow, and upcoming notifications per cow." },
  { icon: "\uD83D\uDCC8", title: "Weight Growth Analytics", desc: "Visualize weight gain over custom time ranges with net change and percentage tracking." },
  { icon: "\uD83E\uDE99", title: "Calving & Pregnancy", desc: "Record calving events, auto-register calves, track pregnancy history and delivery dates." },
  { icon: "\uD83D\uDCB0", title: "ROI & Valuation", desc: "Per-cow profit analysis with milk income, asset value, expense breakdown, and ROI percentage." },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Everything You Need to Manage Your Farm</h2>
          <p className="mt-3 text-lg text-zinc-500">AI-powered tools for modern cattle farming</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 transition hover:border-emerald-200 hover:shadow-md">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 text-lg font-semibold text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
