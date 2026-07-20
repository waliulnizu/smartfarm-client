export default function DuckPanel() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border-2 border-sky-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="mb-1 text-lg font-semibold text-sky-800">
          Egg Collection Count
        </h3>
        <p className="mb-4 text-sm text-sky-600/70">
          Daily egg collection per batch
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-sky-600">0</span>
          <span className="text-sm text-sky-400">eggs today</span>
        </div>
      </div>

      <div className="rounded-xl border-2 border-sky-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="mb-1 text-lg font-semibold text-sky-800">
          Batch Feed Intake
        </h3>
        <p className="mb-4 text-sm text-sky-600/70">
          Feed consumption per duck batch
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-sky-600">0</span>
          <span className="text-sm text-sky-400">kg today</span>
        </div>
      </div>
    </div>
  );
}
