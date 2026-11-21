import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const validStatuses = ["Completed", "Pending", "Cancelled"];

// GET SINGLE TRANSACTION
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        reference: id,
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
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: transaction.reference,
      customerId: transaction.customer.id,
      customer: transaction.customer.name,
      date: transaction.date.toISOString().split("T")[0],
      amount: transaction.amount.toNumber(),
      method: transaction.method,
      status: transaction.status,
    });
  } catch (error) {
    console.error("Failed to fetch transaction:", error);

    return NextResponse.json(
      { error: "Failed to fetch transaction." },
      { status: 500 },
    );
  }
}

// UPDATE TRANSACTION
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const customerId =
      typeof body.customerId === "string" ? body.customerId : "";
    const amount = Number(body.amount);
    const method = typeof body.method === "string" ? body.method.trim() : "";
    const status = typeof body.status === "string" ? body.status : "";

    if (!customerId || !Number.isFinite(amount) || amount <= 0 || !method) {
      return NextResponse.json(
        { error: "Invalid transaction information." },
        { status: 400 },
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid transaction status." },
        { status: 400 },
      );
    }

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        reference: id,
        customer: {
          is: { userId: user.id },
        },
      },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found." },
        { status: 404 },
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

    const transaction = await prisma.transaction.update({
      where: { id: existingTransaction.id },
      data: {
        customerId: customer.id,
        amount,
        method,
        status,
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

    return NextResponse.json({
      id: transaction.reference,
      customerId: transaction.customer.id,
      customer: transaction.customer.name,
      date: transaction.date.toISOString().split("T")[0],
      amount: transaction.amount.toNumber(),
      method: transaction.method,
      status: transaction.status,
    });
  } catch (error) {
    console.error("Failed to update transaction:", error);

    return NextResponse.json(
      { error: "Failed to update transaction." },
      { status: 500 },
    );
  }
}

// DELETE TRANSACTION
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;

    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        reference: id,
        customer: {
          is: { userId: user.id },
        },
      },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found." },
        { status: 404 },
      );
    }

    await prisma.transaction.delete({
      where: {
        id: existingTransaction.id,
      },
    });

    return NextResponse.json({
      message: "Transaction deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete transaction:", error);

    return NextResponse.json(
      { error: "Failed to delete transaction." },
      { status: 500 },
    );
  }
}
