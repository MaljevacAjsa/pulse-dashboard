import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const customers = await prisma.customer.findMany({
      where: {
        userId: user.id,
      },
      include: {
        transactions: {
          select: {
            amount: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCustomers = customers.map((customer) => {
      const totalSpent = customer.transactions.reduce(
        (total, transaction) => total + Number(transaction.amount),
        0,
      );

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        company: customer.company,
        status: customer.status,
        joined: customer.joined.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        orders: customer.transactions.length,
        totalSpent,
      };
    });

    return NextResponse.json(formattedCustomers);
  } catch (error) {
    console.error("Failed to fetch customers:", error);

    return NextResponse.json(
      { error: "Failed to fetch customers." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, company } = body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof company !== "string"
    ) {
      return NextResponse.json(
        { error: "Name, email and company are required." },
        { status: 400 },
      );
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCompany = company.trim() || "Independent";

    if (normalizedName.length < 2) {
      return NextResponse.json(
        { error: "Name must contain at least 2 characters." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        company: normalizedCompany,
        status: "Active",
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        company: customer.company,
        status: customer.status,
        joined: customer.joined.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        orders: 0,
        totalSpent: 0,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create customer:", error);

    return NextResponse.json(
      { error: "Failed to create customer." },
      { status: 500 },
    );
  }
}
