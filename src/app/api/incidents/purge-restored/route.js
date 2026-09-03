import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    await prisma.incident.deleteMany({
      where: {
        status: "restored"
      }
    });
    
    const remaining = await prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    
    return NextResponse.json(remaining);
  } catch (error) {
    console.error("Purge restored incidents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
