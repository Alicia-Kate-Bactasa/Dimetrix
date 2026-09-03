import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = await params;
    
    const existing = await prisma.incident.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }
    
    const incident = await prisma.incident.update({
      where: { id },
      data: {
        confirmationsCount: { increment: 1 }
      },
    });
    
    return NextResponse.json(incident);
  } catch (error) {
    console.error("Confirm incident error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
