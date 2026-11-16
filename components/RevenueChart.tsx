"use client";

import { useEffect, useState } from "react";
import type { Transaction } from "@/lib/transactions";

interface RevenueChartProps {
  data?: {
    month: string;
    amount: number;
  }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [storedData, setStoredData] = useState<
    { month: string; amount: number }[]
  >([]);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    if (data !== undefined) return;

    const saved = localStorage.getItem("pulse-transactions");

    if (!saved) return;

    try {
      const transactions: Transaction[] = JSON.parse(saved);
      const year = new Date().getFullYear();

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const revenue = months.map((month, index) => {
        const amount = transactions
          .filter((transaction) => transaction.status === "Completed")
          .filter((transaction) => {
            const date = new Date(`${transaction.date}T00:00:00`);

            return date.getFullYear() === year && date.getMonth() === index;
          })
          .reduce((total, transaction) => total + transaction.amount, 0);

        return { month, amount };
      });

      setStoredData(revenue);
    } catch {
      console.error("Could not load transactions for RevenueChart.");
    }
  }, [data]);

  const chartData = data ?? storedData;

  const maxAmount = Math.max(...chartData.map((month) => month.amount), 1);

  const hasRevenue = chartData.some((month) => month.amount > 0);

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-[#22232D]">
            Revenue Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monthly revenue performance
          </p>
        </div>

        <div className="shrink-0 rounded-lg bg-violet-50 px-3 py-2 text-sm font-medium text-violet-600 sm:px-4">
          {currentYear ?? ""}
        </div>
      </div>

      {/* CHART */}
      <div className="flex h-60 w-full min-w-0 items-stretch gap-1 overflow-hidden sm:gap-2">
        {chartData.map((month, index) => {
          const barHeight = (month.amount / maxAmount) * 85;

          const shouldShowLabel =
            chartData.length <= 7 ||
            index % 3 === 0 ||
            index === chartData.length - 1;

          return (
            <div
              key={`${month.month}-${index}`}
              className="flex h-full min-w-0 flex-1 flex-col items-center"
            >
              {/* BAR AREA */}
              <div className="flex h-[210px] w-full min-w-0 items-end">
                <div
                  className="w-full rounded-t-lg bg-violet-400 transition-all duration-300 hover:bg-violet-600"
                  style={{
                    height: `${barHeight}%`,
                    minHeight: month.amount > 0 ? "3px" : "0px",
                  }}
                  title={`${month.month}: €${month.amount.toLocaleString("en-US")}`}
                />
              </div>

              {/* X AXIS LABEL */}
              <div className="flex h-[30px] w-full items-center justify-center">
                <span
                  className={`whitespace-nowrap text-[8px] leading-none text-gray-400 sm:text-xs ${
                    shouldShowLabel ? "" : "hidden sm:block"
                  }`}
                >
                  {month.month}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {!hasRevenue && (
        <p className="mt-4 text-center text-sm text-gray-400">
          No completed revenue recorded this year yet.
        </p>
      )}
    </section>
  );
}
