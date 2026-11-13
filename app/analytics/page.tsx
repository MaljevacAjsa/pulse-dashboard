import Sidebar from "@/components/Sidebar";
import RevenueChart from "@/components/RevenueChart";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F8] md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <p className="text-sm text-gray-500">Business performance</p>

          <h1 className="mt-1 text-3xl font-semibold text-[#22232D]">
            Analytics
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Understand your business performance and growth.
          </p>
        </header>

        <RevenueChart />

        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Conversion Rate</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#22232D]">
              4.82%
            </h2>
            <p className="mt-2 text-xs text-green-600">+0.8% this month</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Average Order Value</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#22232D]">
              €86.40
            </h2>
            <p className="mt-2 text-xs text-green-600">+5.2% this month</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Refund Rate</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#22232D]">
              1.24%
            </h2>
            <p className="mt-2 text-xs text-red-500">+0.2% this month</p>
          </div>
        </section>
      </main>
    </div>
  );
}
