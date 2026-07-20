export default function CowPanel() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border-2 border-emerald-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="mb-1 text-lg font-semibold text-emerald-800">
          Milk Production
        </h3>
        <p className="mb-4 text-sm text-emerald-600/70">
          Track daily milk yield per cow
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-emerald-600">0</span>
          <span className="text-sm text-emerald-400">litres today</span>
        </div>
      </div>

      <div className="rounded-xl border-2 border-emerald-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="mb-1 text-lg font-semibold text-emerald-800">
          Individual Weight Tracker
        </h3>
        <p className="mb-4 text-sm text-emerald-600/70">
          Bi-weekly weight records per cow
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-emerald-600">--</span>
          <span className="text-sm text-emerald-400">kg avg</span>
        </div>
      </div>
    </div>
  );
}
