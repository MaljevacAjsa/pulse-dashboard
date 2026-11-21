import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const validStatuses = ["Completed", "Pending", "Cancelled"];

function formatTransaction(transaction: {
  id: string;
  reference: string;
  date: Date;
  amount: { toNumber: () => number };
  method: string;
  status: string;
  customer: { id: string; name: string };
}) {
  return {
    id: transaction.reference,
    customerId: transaction.customer.id,
    customer: transaction.customer.name,
    date: transaction.date.toISOString().split("T")[0],
    amount: transaction.amount.toNumber(),
    method: transaction.method,
    status: transaction.status,
  };
}

// GET TRANSACTIONS
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        customer: {
          is: { userId: user.id },
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(transactions.map(formatTransaction));
  } catch (error) {
    console.error("Failed to fetch transactions:", error);

    return NextResponse.json(
      { error: "Failed to fetch transactions." },
      { status: 500 },
    );
  }
}

// POST TRANSACTION
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();

    const customerId =
      typeof body.customerId === "string" ? body.customerId : "";
    const amount = Number(body.amount);
    const method = typeof body.method === "string" ? body.method.trim() : "";
    const status = typeof body.status === "string" ? body.status : "";

    if (!customerId) {
      return NextResponse.json(
        { error: "Please select a customer." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than zero." },
        { status: 400 },
      );
    }

    if (!method) {
      return NextResponse.json(
        { error: "Please select a payment method." },
        { status: 400 },
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid transaction status." },
        { status: 400 },
      );
    }

    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        userId: user.id,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 },
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        reference: `TRX-${Date.now()}-${randomUUID().slice(0, 8)}`,
        date: new Date(),
        amount,
        method,
        status,
        customerId: customer.id,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(formatTransaction(transaction), { status: 201 });
  } catch (error) {
    console.error("Failed to create transaction:", error);

    return NextResponse.json(
      { error: "Failed to create transaction." },
      { status: 500 },
    );
  }
}
