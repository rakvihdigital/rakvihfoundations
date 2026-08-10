export default function Loading() {
  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <div className="space-y-2">
          <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-56 rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="h-9 w-40 rounded-lg bg-gray-200 animate-pulse" />

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-gray-200 animate-pulse"
          />
        ))}

      </div>

      <div className="h-16 rounded-xl bg-gray-200 animate-pulse" />

      <div className="h-[450px] rounded-xl bg-gray-200 animate-pulse" />

    </div>
  );
}