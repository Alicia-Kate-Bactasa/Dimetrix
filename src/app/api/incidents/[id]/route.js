import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateIncidentSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const incident = await prisma.incident.findUnique({
      where: { id },
    });
    
    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }
    
    return NextResponse.json(incident);
  } catch (error) {
    console.error("Get incident error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = await params;
    const body = await request.json();
    
    const result = updateIncidentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
    }
    
    const existing = await prisma.incident.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }
    
    const incident = await prisma.incident.update({
      where: { id },
      data: result.data,
    });
    
    return NextResponse.json(incident);
  } catch (error) {
    console.error("Update incident error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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
    
    await prisma.incident.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Delete incident error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
