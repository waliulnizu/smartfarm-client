export default function HenPanel() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border-2 border-yellow-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="mb-1 text-lg font-semibold text-yellow-800">
          Egg Collection Count
        </h3>
        <p className="mb-4 text-sm text-yellow-600/70">
          Daily egg collection per batch
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-yellow-600">0</span>
          <span className="text-sm text-yellow-400">eggs today</span>
        </div>
      </div>

      <div className="rounded-xl border-2 border-yellow-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h3 className="mb-1 text-lg font-semibold text-yellow-800">
          Batch Feed Intake
        </h3>
        <p className="mb-4 text-sm text-yellow-600/70">
          Feed consumption per hen batch
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-yellow-600">0</span>
          <span className="text-sm text-yellow-400">kg today</span>
        </div>
      </div>
    </div>
  );
}
