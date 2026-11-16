"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import RevenueChart from "@/components/RevenueChart";
import type { Transaction } from "@/lib/transactions";

export default function AnalyticsPage() {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<
    "7days" | "30days" | "12months"
  >("12months");

  useEffect(() => {
    const savedTransactions = localStorage.getItem("pulse-transactions");

    if (savedTransactions) {
      try {
        const parsedTransactions: Transaction[] = JSON.parse(savedTransactions);

        if (Array.isArray(parsedTransactions)) {
          setTransactionList(parsedTransactions);
        }
      } catch {
        console.error("Could not load saved transactions.");
      }
    }
    setCurrentDate(new Date());
    setIsLoaded(true);
  }, []);

  // Filter transactions according to the selected period.
  const periodTransactions = useMemo(() => {
    if (!currentDate) return [];

    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);

    if (selectedPeriod === "7days") {
      startDate.setDate(today.getDate() - 6);
    } else if (selectedPeriod === "30days") {
      startDate.setDate(today.getDate() - 29);
    } else {
      startDate.setDate(1);
      startDate.setMonth(today.getMonth() - 11);
    }

    return transactionList.filter((transaction) => {
      const transactionDate = new Date(`${transaction.date}T00:00:00`);

      return transactionDate >= startDate && transactionDate <= today;
    });
  }, [transactionList, selectedPeriod, currentDate]);

  // Separate transactions by status.
  const completedTransactions = periodTransactions.filter(
    (transaction) => transaction.status === "Completed",
  );

  const pendingTransactions = periodTransactions.filter(
    (transaction) => transaction.status === "Pending",
  );

  const cancelledTransactions = periodTransactions.filter(
    (transaction) => transaction.status === "Cancelled",
  );

  // Calculate statistics for the selected period.
  const totalRevenue = completedTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const averageOrderValue =
    completedTransactions.length > 0
      ? totalRevenue / completedTransactions.length
      : 0;

  const completionRate =
    periodTransactions.length > 0
      ? (completedTransactions.length / periodTransactions.length) * 100
      : 0;

  const cancellationRate =
    periodTransactions.length > 0
      ? (cancelledTransactions.length / periodTransactions.length) * 100
      : 0;

  // Prepare chart data according to the selected period.
  const revenueData = useMemo(() => {
    if (!currentDate) return [];

    const completed = transactionList.filter(
      (transaction) => transaction.status === "Completed",
    );

    // Last 7 or 30 days.
    if (selectedPeriod === "7days" || selectedPeriod === "30days") {
      const numberOfDays = selectedPeriod === "7days" ? 7 : 30;

      return Array.from({ length: numberOfDays }, (_, index) => {
        const date = new Date(currentDate);
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (numberOfDays - 1 - index));

        const amount = completed
          .filter((transaction) => {
            const transactionDate = new Date(`${transaction.date}T00:00:00`);

            return (
              transactionDate.getFullYear() === date.getFullYear() &&
              transactionDate.getMonth() === date.getMonth() &&
              transactionDate.getDate() === date.getDate()
            );
          })
          .reduce((total, transaction) => total + transaction.amount, 0);

        return {
          month:
            selectedPeriod === "30days"
              ? `${date.getDate()}.${date.getMonth() + 1}.`
              : date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
          amount,
        };
      });
    }

    // Last 12 months.
    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(currentDate);
      date.setDate(1);
      date.setMonth(date.getMonth() - (11 - index));

      const amount = completed
        .filter((transaction) => {
          const transactionDate = new Date(`${transaction.date}T00:00:00`);

          return (
            transactionDate.getFullYear() === date.getFullYear() &&
            transactionDate.getMonth() === date.getMonth()
          );
        })
        .reduce((total, transaction) => total + transaction.amount, 0);

      return {
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        amount,
      };
    });
  }, [transactionList, selectedPeriod, currentDate]);

  // Additional revenue statistics.
  const periodRevenue = revenueData.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const averagePeriodRevenue =
    revenueData.length > 0 ? periodRevenue / revenueData.length : 0;

  const bestPeriod = revenueData.reduce(
    (best, item) => (item.amount > best.amount ? item : best),
    { month: "—", amount: 0 },
  );

  const averageLabel =
    selectedPeriod === "12months"
      ? "Average Monthly Revenue"
      : "Average Daily Revenue";

  const bestPeriodLabel =
    selectedPeriod === "12months" ? "Best Month" : "Best Day";

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F5F8]">
        <p className="text-sm text-gray-500">Loading analytics...</p>
      </div>
    );
  }
  const handleExportAnalytics = () => {
    const headers = [
      "Transaction ID",
      "Customer",
      "Date",
      "Amount",
      "Payment Method",
      "Status",
    ];

    const rows = periodTransactions.map((transaction) => [
      transaction.id,
      transaction.customer,
      transaction.date,
      transaction.amount,
      transaction.method,
      transaction.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `pulse-analytics-${selectedPeriod}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F8FC] md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <p className="text-sm text-gray-500">Business performance</p>
          <div className="flex items-center justify-between">
            <h1 className="mt-1 text-3xl font-semibold text-[#22232D]">
              Analytics
            </h1>
            <button
              onClick={handleExportAnalytics}
              className="rounded-lg bg-[#542025] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6b2c33]"
            >
              Export CSV
            </button>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Understand your business performance and growth.
          </p>
        </header>

        {/* Main statistics */}
        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>

            <h2 className="mt-3 text-2xl font-semibold text-[#22232D]">
              €
              {totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>

            <p className="mt-2 text-xs text-gray-400">
              From completed transactions in selected period
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Transactions</p>

            <h2 className="mt-3 text-2xl font-semibold text-[#22232D]">
              {periodTransactions.length}
            </h2>

            <p className="mt-2 text-xs text-gray-400">
              All statuses in selected period
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Completed Transactions</p>

            <h2 className="mt-3 text-2xl font-semibold text-green-600">
              {completedTransactions.length}
            </h2>

            <p className="mt-2 text-xs text-gray-400">Successfully completed</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Pending Transactions</p>

            <h2 className="mt-3 text-2xl font-semibold text-amber-600">
              {pendingTransactions.length}
            </h2>

            <p className="mt-2 text-xs text-gray-400">Awaiting completion</p>
          </div>
        </section>

        {/* Revenue performance */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#22232D]">
                Revenue Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select a period to analyze your revenue.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPeriod("7days")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedPeriod === "7days"
                    ? "bg-violet-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-violet-50"
                }`}
              >
                7 Days
              </button>

              <button
                onClick={() => setSelectedPeriod("30days")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedPeriod === "30days"
                    ? "bg-violet-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-violet-50"
                }`}
              >
                30 Days
              </button>

              <button
                onClick={() => setSelectedPeriod("12months")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedPeriod === "12months"
                    ? "bg-violet-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-violet-50"
                }`}
              >
                12 Months
              </button>
            </div>
          </div>

          {/* Revenue summary cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-violet-50 p-5">
              <p className="text-sm text-violet-600">
                Revenue in Selected Period
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-[#22232D]">
                €
                {periodRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="text-sm text-blue-600">{averageLabel}</p>

              <h3 className="mt-2 text-2xl font-semibold text-[#22232D]">
                €
                {averagePeriodRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>

            <div className="rounded-xl bg-amber-50 p-5">
              <p className="text-sm text-amber-600">{bestPeriodLabel}</p>

              <h3 className="mt-2 text-2xl font-semibold text-[#22232D]">
                {bestPeriod.amount > 0 ? bestPeriod.month : "—"}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                €
                {bestPeriod.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <RevenueChart data={revenueData} />
        </section>

        {/* Additional statistics */}
        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Completion Rate</p>

            <h2 className="mt-3 text-2xl font-semibold text-[#22232D]">
              {completionRate.toFixed(2)}%
            </h2>

            <p className="mt-2 text-xs text-gray-400">
              Share of completed transactions
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Average Order Value</p>

            <h2 className="mt-3 text-2xl font-semibold text-[#22232D]">
              €
              {averageOrderValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>

            <p className="mt-2 text-xs text-gray-400">
              Average completed transaction
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Cancellation Rate</p>

            <h2 className="mt-3 text-2xl font-semibold text-[#22232D]">
              {cancellationRate.toFixed(2)}%
            </h2>

            <p className="mt-2 text-xs text-gray-400">
              {cancelledTransactions.length} cancelled transactions
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
