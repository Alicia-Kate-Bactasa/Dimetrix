import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createIncidentSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { toSnake, toCamel } from "@/lib/serialize";

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json(toSnake(incidents));
  } catch (error) {
    console.error("Fetch incidents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createIncidentSchema.safeParse(toCamel(body));

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
    }

    const incident = await prisma.incident.create({
      data: {
        ...result.data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(toSnake(incident), { status: 201 });
  } catch (error) {
    console.error("Create incident error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
