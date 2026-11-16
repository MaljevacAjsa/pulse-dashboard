"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
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

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Olivia Rhye",
    email: "olivia@example.com",
    company: "Orbit Studio",
    totalSpent: 2450,
    orders: 12,
    status: "Active",
    joined: "Oct 12, 2026",
  },
  {
    id: 2,
    name: "Phoenix Baker",
    email: "phoenix@example.com",
    company: "Baker Design",
    totalSpent: 1820,
    orders: 8,
    status: "Active",
    joined: "Oct 08, 2026",
  },
  {
    id: 3,
    name: "Lana Steiner",
    email: "lana@example.com",
    company: "Steiner Creative",
    totalSpent: 980,
    orders: 5,
    status: "Inactive",
    joined: "Sep 29, 2026",
  },
  {
    id: 4,
    name: "Demi Wilkinson",
    email: "demi@example.com",
    company: "Wilkinson Co.",
    totalSpent: 3240,
    orders: 16,
    status: "Active",
    joined: "Sep 21, 2026",
  },
  {
    id: 5,
    name: "Candice Wu",
    email: "candice@example.com",
    company: "Wu Enterprises",
    totalSpent: 760,
    orders: 3,
    status: "Inactive",
    joined: "Sep 15, 2026",
  },
  {
    id: 6,
    name: "Natali Craig",
    email: "natali@example.com",
    company: "Craig Media",
    totalSpent: 1560,
    orders: 7,
    status: "Active",
    joined: "Sep 10, 2026",
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isLoaded, setIsLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(
    null,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    const savedCustomers = localStorage.getItem("pulse-customers");

    if (savedCustomers) {
      try {
        const parsedCustomers: unknown = JSON.parse(savedCustomers);

        if (Array.isArray(parsedCustomers)) {
          setCustomers(parsedCustomers as Customer[]);
        }
      } catch (error) {
        console.error("Failed to load customers:", error);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("pulse-customers", JSON.stringify(customers));
  }, [customers, isLoaded]);

  // Search and filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.company.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  // Calculate statistics
  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active",
  ).length;

  const totalRevenue = customers.reduce(
    (total, customer) => total + customer.totalSpent,
    0,
  );

  // Add or update customer
  function handleAddCustomer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingCustomerId !== null) {
      setCustomers((previousCustomers) =>
        previousCustomers.map((customer) =>
          customer.id === editingCustomerId
            ? {
                ...customer,
                name: name.trim(),
                email: email.trim(),
                company: company.trim() || "Independent",
              }
            : customer,
        ),
      );
    } else {
      const newCustomer: Customer = {
        id:
          customers.length > 0
            ? Math.max(...customers.map((customer) => customer.id)) + 1
            : 1,
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || "Independent",
        totalSpent: 0,
        orders: 0,
        status: "Active",
        joined: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      setCustomers((previousCustomers) => [newCustomer, ...previousCustomers]);
    }

    resetForm();
  }

  // Reset form
  function resetForm() {
    setName("");
    setEmail("");
    setCompany("");
    setEditingCustomerId(null);
    setIsModalOpen(false);
  }

  // Open edit form
  function handleEditCustomer(customer: Customer) {
    setEditingCustomerId(customer.id);
    setName(customer.name);
    setEmail(customer.email);
    setCompany(customer.company);
    setIsModalOpen(true);
  }

  // Delete customer
  function handleDeleteCustomer(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmed) return;

    setCustomers((previousCustomers) =>
      previousCustomers.filter((customer) => customer.id !== id),
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F8FC] md:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-violet-600">
                MANAGEMENT
              </p>

              <h1 className="text-3xl font-bold tracking-tight">Customers</h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage and monitor your customer relationships.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingCustomerId(null);
                setName("");
                setEmail("");
                setCompany("");
                setIsModalOpen(true);
              }}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              + Add customer
            </button>
          </div>

          {/* Statistics */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total customers</p>
              <p className="mt-3 text-3xl font-bold">{customers.length}</p>
              <p className="mt-2 text-sm text-green-600">
                Customer accounts in the system
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Active customers</p>
              <p className="mt-3 text-3xl font-bold">{activeCustomers}</p>
              <p className="mt-2 text-sm text-green-600">
                {customers.length > 0
                  ? Math.round((activeCustomers / customers.length) * 100)
                  : 0}
                % of all customers
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total customer spending</p>
              <p className="mt-3 text-3xl font-bold">
                ${totalRevenue.toLocaleString("en-US")}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Combined spending of all customers
              </p>
            </div>
          </section>

          {/* Customers table */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">All customers</h2>
                <p className="mt-1 text-sm text-gray-500">
                  A complete list of your customers.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-400"
                >
                  <option value="All">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium">Orders</th>
                    <th className="px-6 py-4 font-medium">Total spent</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {customer.name}
                        </p>
                        <p className="mt-1 text-gray-500">{customer.email}</p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {customer.company}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {customer.orders}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-medium">
                        ${customer.totalSpent.toLocaleString("en-US")}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            customer.status === "Active"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                        {customer.joined}
                      </td>

                      {/* Edit and Delete buttons */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="font-medium text-violet-600 hover:text-violet-800"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="font-medium text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="font-medium text-violet-600 hover:text-violet-800 hover:underline"
                        >
                          View profile →
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No customers found. Try changing your search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          </section>
        </div>
      </main>

      {/* Add / Edit modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={resetForm}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editingCustomerId !== null
                    ? "Edit customer"
                    : "Add new customer"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingCustomerId !== null
                    ? "Update the customer's information."
                    : "Enter the customer's information."}
                </p>
              </div>

              <button
                onClick={resetForm}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full name
                </label>

                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email address
                </label>

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="alex@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Company <span className="text-gray-400">(optional)</span>
                </label>

                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Company name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  {editingCustomerId !== null ? "Save changes" : "Add customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
