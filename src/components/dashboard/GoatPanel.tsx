export default function GoatPanel() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border-2 border-amber-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="mb-1 text-lg font-semibold text-amber-800">
          Milk Production
        </h3>
        <p className="mb-4 text-sm text-amber-600/70">
          Track daily milk yield per goat
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-amber-600">0</span>
          <span className="text-sm text-amber-400">litres today</span>
        </div>
      </div>

      <div className="rounded-xl border-2 border-amber-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="mb-1 text-lg font-semibold text-amber-800">
          Individual Weight Tracker
        </h3>
        <p className="mb-4 text-sm text-amber-600/70">
          Bi-weekly weight records per goat
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-amber-600">--</span>
          <span className="text-sm text-amber-400">kg avg</span>
        </div>
      </div>
    </div>
  );
}
