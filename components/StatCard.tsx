interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>

        <span className="text-2xl">{icon}</span>
      </div>

      <h2 className="mt-4 text-2xl font-semibold text-[#22232D]">{value}</h2>

      <p className="mt-2 text-sm font-medium text-emerald-600">↗ {change}</p>
    </div>
  );
}
