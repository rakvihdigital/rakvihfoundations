export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-52 rounded-3xl bg-gray-200" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-32 rounded-2xl bg-gray-200" />
        <div className="h-32 rounded-2xl bg-gray-200" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-80 rounded-3xl bg-gray-200"
          />
        ))}
      </div>
    </div>
  );
}