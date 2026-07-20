"use client";

const STATS = [
  { value: "500+", label: "Farms Using SmartKhamar" },
  { value: "12K+", label: "Animals Tracked" },
  { value: "98%", label: "Vaccination Compliance" },
  { value: "\u09F32.4M", label: "Farmer Profit Increased" },
];

export default function StatisticsSection() {
  return (
    <section className="bg-gradient-to-r from-emerald-800 to-teal-800 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold text-white sm:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm font-medium text-emerald-200">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
