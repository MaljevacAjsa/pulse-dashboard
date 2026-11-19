import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// UPDATE CUSTOMER
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { name, email, company } = body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof company !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid customer information." },
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

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 },
      );
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: normalizedName,
        email: normalizedEmail,
        company: normalizedCompany,
      },
    });

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Failed to update customer:", error);

    return NextResponse.json(
      { error: "Failed to update customer." },
      { status: 500 },
    );
  }
}

// DELETE CUSTOMER
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 },
      );
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Customer deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete customer:", error);

    return NextResponse.json(
      { error: "Failed to delete customer." },
      { status: 500 },
    );
  }
}
