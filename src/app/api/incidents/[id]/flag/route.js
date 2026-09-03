import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { toSnake } from "@/lib/serialize";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const limit = rateLimit({ key: `flag:${session.user.id}:${ip}`, limit: 20, windowMs: 60_000 });
    if (!limit.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;

    const existing = await prisma.incident.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    const incident = await prisma.incident.update({
      where: { id },
      data: {
        flagCount: { increment: 1 },
      },
    });

    return NextResponse.json(toSnake(incident));
  } catch (error) {
    console.error("Flag incident error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
