"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import type { Transaction } from "@/lib/transactions";

export default function TransactionDetails({ id }: { id: string }) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pulse-transactions");

    if (saved) {
      try {
        const parsed: Transaction[] = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const found = parsed.find((item) => item.id === id);
          setTransaction(found ?? null);
        }
      } catch {
        console.error("Could not load transaction.");
      }
    }

    setIsLoaded(true);
  }, [id]);

  if (!isLoaded) {
    return <main className="p-8 text-gray-500">Loading...</main>;
  }

  if (!transaction) {
    return (
      <main className="min-h-screen bg-[#F6F5F8] p-8">
        <Link href="/transactions" className="text-violet-600 hover:underline">
          ← Back to transactions
        </Link>
        <h1 className="mt-8 text-2xl font-semibold text-[#22232D]">
          Transaction not found
        </h1>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F8] md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <Link
          href="/transactions"
          className="text-sm text-violet-600 hover:underline"
        >
          ← Back to transactions
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-sm text-gray-500">
            Financial management / Transactions
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#22232D]">
            Transaction Details
          </h1>
        </header>

        <section className="max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-6">
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <h2 className="mt-1 text-xl font-semibold text-violet-600">
                {transaction.id}
              </h2>
            </div>

            <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              {transaction.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="mt-1 font-medium text-[#22232D]">
                {transaction.customer}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="mt-1 font-medium text-[#22232D]">
                {transaction.date}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="mt-1 font-medium text-[#22232D]">
                {transaction.method}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="mt-1 text-2xl font-semibold text-[#22232D]">
                €{transaction.amount.toLocaleString("en-US")}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
