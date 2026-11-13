const orders = [
  {
    id: "#ORD-001",
    customer: "Olivia Martin",
    date: "Nov 13, 2026",
    amount: "€240.00",
    status: "Completed",
  },
  {
    id: "#ORD-002",
    customer: "James Wilson",
    date: "Nov 12, 2026",
    amount: "€180.00",
    status: "Pending",
  },
  {
    id: "#ORD-003",
    customer: "Sophia Anderson",
    date: "Nov 12, 2026",
    amount: "€520.00",
    status: "Completed",
  },
  {
    id: "#ORD-004",
    customer: "Noah Taylor",
    date: "Nov 11, 2026",
    amount: "€95.00",
    status: "Cancelled",
  },
  {
    id: "#ORD-005",
    customer: "Emma Thomas",
    date: "Nov 10, 2026",
    amount: "€310.00",
    status: "Completed",
  },
];

export default function RecentOrders() {
  return (
    <section className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#22232D]">
            Recent Orders
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Latest transactions from your store
          </p>
        </div>

        <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
              <th className="pb-4 font-medium">Order ID</th>
              <th className="pb-4 font-medium">Customer</th>
              <th className="pb-4 font-medium">Date</th>
              <th className="pb-4 font-medium">Amount</th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="py-4 text-sm font-medium text-violet-600">
                  {order.id}
                </td>

                <td className="py-4 text-sm font-medium text-[#22232D]">
                  {order.customer}
                </td>

                <td className="py-4 text-sm text-gray-500">{order.date}</td>

                <td className="py-4 text-sm font-semibold text-[#22232D]">
                  {order.amount}
                </td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "Completed"
                        ? "bg-green-50 text-green-600"
                        : order.status === "Pending"
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-red-50 text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
