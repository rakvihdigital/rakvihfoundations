export default function Loading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      {/* Hero */}
      <div className="h-64 rounded-3xl bg-[#6B7328]/10 dark:bg-[#1E3A5F]/30" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] bg-white dark:bg-[#0F172A] p-4"
          >
            <div className="h-3 w-20 rounded bg-[#6B7328]/20" />

            <div className="mt-4 h-8 w-12 rounded bg-[#6B7328]/20" />

            <div className="mt-5 h-2 w-full rounded-full bg-[#6B7328]/10 overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#6B7328] to-[#FFC107]" />
            </div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#E8ECE5] dark:border-[#1E3A5F] bg-white dark:bg-[#0F172A] p-5"
          >
            <div className="h-4 w-24 rounded bg-[#6B7328]/20" />

            <div className="mt-4 h-6 w-3/4 rounded bg-[#6B7328]/20" />

            <div className="mt-3 h-3 w-full rounded bg-[#6B7328]/10" />

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 rounded-xl bg-[#6B7328]/10"
                />
              ))}
            </div>

            <div className="mt-6 h-2 w-full rounded-full bg-[#6B7328]/10" />
          </div>
        ))}
      </div>
    </div>
  );
}