const revenueData = [
  { month: "Jan", amount: 42 },
  { month: "Feb", amount: 58 },
  { month: "Mar", amount: 48 },
  { month: "Apr", amount: 72 },
  { month: "May", amount: 65 },
  { month: "Jun", amount: 88 },
  { month: "Jul", amount: 76 },
  { month: "Aug", amount: 92 },
  { month: "Sep", amount: 70 },
  { month: "Oct", amount: 84 },
  { month: "Nov", amount: 100 },
  { month: "Dec", amount: 78 },
];

export default function RevenueChart() {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#22232D]">
            Revenue Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monthly revenue performance
          </p>
        </div>

        <div className="rounded-lg bg-violet-50 px-4 py-2 text-sm font-medium text-violet-600">
          2026
        </div>
      </div>

      <div className="flex h-56 items-end justify-between gap-2">
        {revenueData.map((month) => (
          <div
            key={month.month}
            className="flex h-full flex-1 flex-col items-center justify-end gap-3"
          >
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-t-lg bg-violet-400 transition-all duration-300 hover:bg-violet-600"
                style={{ height: `${month.amount}%` }}
                title={`${month.month}: ${month.amount}%`}
              />
            </div>

            <span className="text-xs text-gray-400">{month.month}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
