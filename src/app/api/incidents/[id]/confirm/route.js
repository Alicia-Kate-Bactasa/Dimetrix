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
    const limit = rateLimit({ key: `confirm:${session.user.id}:${ip}`, limit: 20, windowMs: 60_000 });
    if (!limit.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;

    const existing = await prisma.incident.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    // Check if user already confirmed this incident
    const alreadyConfirmed = await prisma.incidentConfirmation.findUnique({
      where: {
        incidentId_userId: {
          incidentId: id,
          userId: session.user.id,
        },
      },
    });

    if (alreadyConfirmed) {
      return NextResponse.json(
        { error: "You have already confirmed this outage report." },
        { status: 400 }
      );
    }

    const [_, incident] = await prisma.$transaction([
      prisma.incidentConfirmation.create({
        data: {
          incidentId: id,
          userId: session.user.id,
        },
      }),
      prisma.incident.update({
        where: { id },
        data: {
          confirmationsCount: { increment: 1 },
        },
      }),
    ]);

    const serialized = toSnake(incident);
    serialized.has_confirmed = true;
    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Confirm incident error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
