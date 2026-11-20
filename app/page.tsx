import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const [customers, revenue, transactions] = await Promise.all([
      prisma.customer.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          status: true,
        },
      }),

      prisma.transaction.aggregate({
        where: {
          status: "Completed",
          customer: {
            userId: user.id,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.transaction.findMany({
        where: {
          customer: {
            userId: user.id,
          },
        },
        include: {
          customer: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        take: 5,
      }),
    ]);

    const totalRevenue = revenue._sum.amount?.toNumber() ?? 0;

    return NextResponse.json({
      totalRevenue,
      totalExpenses: 0,
      netProfit: totalRevenue,
      activeCustomers: customers.filter(
        (customer) => customer.status === "Active",
      ).length,
      recentTransactions: transactions.map((transaction) => ({
        id: transaction.reference,
        customer: transaction.customer.name,
        date: transaction.date.toISOString().split("T")[0],
        amount: transaction.amount.toNumber(),
        status: transaction.status,
      })),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      { error: "Failed to load dashboard." },
      { status: 500 },
    );
  }
}
