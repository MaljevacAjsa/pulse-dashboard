"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import {
  transactions as initialTransactions,
  type Transaction,
} from "@/lib/transactions";

export default function TransactionsPage() {
  const [transactionList, setTransactionList] =
    useState<Transaction[]>(initialTransactions);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
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

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "pulse-transactions",
        JSON.stringify(transactionList),
      );
    }
  }, [transactionList, isLoaded]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Credit Card");
  const [transactionStatus, setTransactionStatus] =
    useState<Transaction["status"]>("Completed");

  function handleSaveTransaction() {
    if (!customer.trim()) {
      alert("Please enter the customer name.");
      return;
    }

    if (customer.trim().length < 2) {
      alert("Customer name must contain at least 2 characters.");
      return;
    }

    if (!amount || Number(amount) <= 0 || !Number.isFinite(Number(amount))) {
      alert("Please enter a valid amount greater than zero.");
      return;
    }

    if (!method.trim()) {
      alert("Please select a payment method.");
      return;
    }

    if (editingTransaction) {
      setTransactionList((previous) =>
        previous.map((transaction) =>
          transaction.id === editingTransaction.id
            ? {
                ...transaction,
                customer: customer.trim(),
                amount: Number(amount),
                method,
                status: transactionStatus,
              }
            : transaction,
        ),
      );
    } else {
      const newTransaction: Transaction = {
        id: `TRX-${Date.now()}`,
        customer: customer.trim(),
        date: new Date().toISOString().split("T")[0],
        amount: Number(amount),
        method,
        status: transactionStatus,
      };

      setTransactionList((previous) => [newTransaction, ...previous]);
    }

    setCustomer("");
    setAmount("");
    setMethod("Credit Card");
    setTransactionStatus("Completed");
    setEditingTransaction(null);
    setIsModalOpen(false);
  }

  function handleEditTransaction(transaction: Transaction) {
    setEditingTransaction(transaction);
    setCustomer(transaction.customer);
    setAmount(String(transaction.amount));
    setMethod(transaction.method);
    setTransactionStatus(transaction.status);
    setIsModalOpen(true);
  }

  function handleDeleteTransaction(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmed) return;

    setTransactionList((previous) =>
      previous.filter((transaction) => transaction.id !== id),
    );
  }
  function handleExportCSV() {
    const headers = [
      "Transaction ID",
      "Customer",
      "Date",
      "Payment Method",
      "Amount",
      "Status",
    ];

    const rows = paginatedTransactions.map((transaction) => [
      transaction.id,
      transaction.customer,
      transaction.date,
      transaction.method,
      transaction.amount.toString(),
      transaction.status,
    ]);

    const escapeCSV = (value: string) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "pulse-transactions.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  const filteredTransactions = transactionList.filter((transactionList) => {
    const matchesSearch =
      transactionList.customer.toLowerCase().includes(search.toLowerCase()) ||
      transactionList.id.toLowerCase().includes(search.toLowerCase()) ||
      transactionList.method.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === "All" || transactionList.status === status;

    return matchesSearch && matchesStatus;
  });
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();

      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();

      case "highest":
        return b.amount - a.amount;

      case "lowest":
        return a.amount - b.amount;

      default:
        return 0;
    }
  });
  const itemsPerPage = 5;

  const totalPages = Math.max(
    1,
    Math.ceil(sortedTransactions.length / itemsPerPage),
  );

  const displayedPage = Math.min(currentPage, totalPages);

  const startIndex = (displayedPage - 1) * itemsPerPage;

  const paginatedTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalTransactions = filteredTransactions.length;

  const totalAmount = filteredTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const completedTransactions = filteredTransactions.filter(
    (transaction) => transaction.status === "Completed",
  ).length;
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h3 className="mt-2 text-2xl font-semibold text-gray-900">
              {totalTransactions}
            </h3>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total Transaction Value</p>
            <h3 className="mt-2 text-2xl font-semibold text-gray-900">
              $
              {totalAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Completed Transactions</p>
            <h3 className="mt-2 text-2xl font-semibold text-gray-900">
              {completedTransactions}
            </h3>
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value as "newest" | "oldest" | "highest" | "lowest",
            )
          }
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest amount</option>
          <option value="lowest">Lowest amount</option>
        </select>
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-lg font-semibold text-[#22232D]">
              All Transactions
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Search and filter your transactionList.
            </p>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setCustomer("");
                setAmount("");
                setMethod("Credit Card");
                setTransactionStatus("Completed");
                setIsModalOpen(true);
              }}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              + Add Transaction
            </button>
            <button
              onClick={handleExportCSV}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Export CSV
            </button>
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
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-50">
                    <td className="py-4 text-sm font-medium text-violet-600">
                      <Link
                        href={`/transactions/${transaction.id}`}
                        className="hover:underline"
                      >
                        {transaction.id}
                      </Link>
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

                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-medium text-violet-600 transition hover:bg-violet-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-sm text-gray-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {displayedPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((previous) => Math.max(1, previous - 1))
                  }
                  disabled={displayedPage === 1}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((previous) =>
                      Math.min(totalPages, previous + 1),
                    )
                  }
                  disabled={displayedPage === totalPages}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Showing {filteredTransactions.length} of {transactionList.length}{" "}
            transactions
          </p>
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#22232D]">
                  {editingTransaction ? "Edit Transaction" : "Add Transaction"}
                </h2>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-xl text-gray-400 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Customer name
                  </label>
                  <input
                    value={customer}
                    onChange={(event) => setCustomer(event.target.value)}
                    placeholder="Enter customer name"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Amount (€)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Payment method
                  </label>
                  <select
                    value={method}
                    onChange={(event) => setMethod(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <select
                    value={transactionStatus}
                    onChange={(event) =>
                      setTransactionStatus(
                        event.target.value as Transaction["status"],
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm text-gray-600"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveTransaction}
                  className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-700"
                >
                  {editingTransaction ? "Save Changes" : "Save Transaction"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
