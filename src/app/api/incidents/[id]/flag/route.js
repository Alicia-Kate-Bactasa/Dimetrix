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

    // Check if user already flagged this incident
    const alreadyFlagged = await prisma.incidentFlag.findUnique({
      where: {
        incidentId_userId: {
          incidentId: id,
          userId: session.user.id,
        },
      },
    });

    if (alreadyFlagged) {
      return NextResponse.json(
        { error: "You have already flagged this report." },
        { status: 400 }
      );
    }

    let reason = "False Report";
    try {
      const body = await request.json();
      if (body?.reason) reason = String(body.reason).slice(0, 200);
    } catch (_) {}

    const [_, incident] = await prisma.$transaction([
      prisma.incidentFlag.create({
        data: {
          incidentId: id,
          userId: session.user.id,
          reason,
        },
      }),
      prisma.incident.update({
        where: { id },
        data: {
          flagCount: { increment: 1 },
        },
      }),
    ]);

    const serialized = toSnake(incident);
    serialized.has_flagged = true;
    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Flag incident error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
