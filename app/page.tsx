import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import RevenueChart from "@/components/RevenueChart";
import RecentOrders from "@/components/RecentOrders";

const stats = [
  {
    title: "Total Revenue",
    value: "€24,580",
    change: "+12.8% this month",
    icon: "💰",
  },
  {
    title: "Total Expenses",
    value: "€8,240",
    change: "+3.2% this month",
    icon: "💳",
  },
  {
    title: "Net Profit",
    value: "€16,340",
    change: "+18.4% this month",
    icon: "📈",
  },
  {
    title: "Active Customers",
    value: "1,284",
    change: "+8.6% this month",
    icon: "👥",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F8] md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <p className="text-sm text-gray-500">Welcome back!</p>

          <h1 className="mt-1 text-3xl font-semibold text-[#22232D]">
            Overview
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Here's what's happening with your business today.
          </p>
        </header>

        {/* Statistics cards */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
            />
          ))}
        </section>
        <div className="mt-8">
          <RevenueChart />
        </div>
        <RecentOrders />
      </main>
    </div>
  );
}
