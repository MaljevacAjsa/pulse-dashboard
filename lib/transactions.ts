export interface Transaction {
  id: string;
  customer: string;
  date: string;
  amount: number;
  method: string;
  status: "Completed" | "Pending" | "Cancelled";
}

export const transactions: Transaction[] = [
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
