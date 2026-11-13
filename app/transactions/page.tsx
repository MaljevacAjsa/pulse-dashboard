"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

const transactions = [
  {
    id: "TRX-001",
    customer: "Olivia Martin",
    date: "2026-11-13",
    amount: 240,
    method: "Credit Card",
    status: "Completed",
  },
  {
    id: "TRX-002",
    customer: "James Wilson",
    date: "2026-11-12",
    amount: 180,
    method: "PayPal",
    status: "Pending",
  },
  {
    id: "TRX-003",
    customer: "Sophia Anderson",
    date: "2026-11-12",
    amount: 520,
    method: "Credit Card",
    status: "Completed",
  },
  {
    id: "TRX-004",
    customer: "Noah Taylor",
    date: "2026-11-11",
    amount: 95,
    method: "Bank Transfer",
    status: "Cancelled",
  },
  {
    id: "TRX-005",
    customer: "Emma Thomas",
    date: "2026-11-10",
    amount: 310,
    method: "PayPal",
    status: "Completed",
  },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.customer.toLowerCase().includes(search.toLowerCase()) ||
      transaction.id.toLowerCase().includes(search.toLowerCase()) ||
      transaction.method.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === "All" || transaction.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F8] md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <p className="text-sm text-gray-500">Financial management</p>

          <h1 className="mt-1 text-3xl font-semibold text-[#22232D]">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage and monitor all your transactions.
          </p>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#22232D]">
              {transactions.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Completed</p>
            <h2 className="mt-2 text-2xl font-semibold text-green-600">
              {transactions.filter((t) => t.status === "Completed").length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#22232D]">
              €
              {transactions
                .filter((t) => t.status === "Completed")
                .reduce((total, t) => total + t.amount, 0)
                .toLocaleString("en-US")}
            </h2>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#22232D]">
              All Transactions
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Search and filter your transactions.
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search by customer, ID or payment method..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
            >
              <option value="All">All statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                  <th className="pb-4">Transaction ID</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Method</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-50">
                    <td className="py-4 text-sm font-medium text-violet-600">
                      {transaction.id}
                    </td>
                    <td className="py-4 text-sm text-[#22232D]">
                      {transaction.customer}
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {transaction.method}
                    </td>
                    <td className="py-4 text-sm font-semibold text-[#22232D]">
                      €{transaction.amount.toLocaleString("en-US")}
                    </td>
                    <td className="py-4 text-sm">{transaction.status}</td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-sm text-gray-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
          </p>
        </section>
      </main>
    </div>
  );
}
