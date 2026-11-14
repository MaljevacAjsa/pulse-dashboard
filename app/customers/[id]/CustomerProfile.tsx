"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
  totalSpent: number;
  orders: number;
  status: "Active" | "Inactive";
  joined: string;
}

export default function CustomerProfile({ id }: { id: string }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCustomers = localStorage.getItem("pulse-customers");

    if (savedCustomers) {
      try {
        const parsedCustomers: Customer[] = JSON.parse(savedCustomers);

        const foundCustomer = parsedCustomers.find(
          (item) => item.id === Number(id),
        );

        setCustomer(foundCustomer ?? null);
      } catch (error) {
        console.error("Failed to load customer:", error);
        setCustomer(null);
      }
    }

    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F8F8FC] p-8">
        <p className="text-gray-500">Loading customer...</p>
      </main>
    );
  }

  if (!customer) {
    return (
      <main className="min-h-screen bg-[#F8F8FC] p-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer not found</h1>

        <Link
          href="/customers"
          className="mt-4 inline-block text-violet-600 hover:underline"
        >
          Back to customers
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F8FC] p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/customers"
          className="mb-8 inline-block text-sm text-violet-600 hover:underline"
        >
          ← Back to customers
        </Link>

        <div className="mb-8">
          <p className="text-sm text-gray-500">Customer profile</p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {customer.name}
          </h1>

          <p className="mt-2 text-gray-500">{customer.email}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer information
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                customer.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {customer.status}
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="mt-1 font-medium text-gray-900">
                {customer.company}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email address</p>
              <p className="mt-1 font-medium text-gray-900">{customer.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date joined</p>
              <p className="mt-1 font-medium text-gray-900">
                {customer.joined}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Customer ID</p>
              <p className="mt-1 font-medium text-gray-900">#{customer.id}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total spent</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {customer.totalSpent.toLocaleString("en-US")} RSD
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total orders</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {customer.orders}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
