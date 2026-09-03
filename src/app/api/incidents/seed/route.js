import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const seedIncidents = [
      {
        title: "Official Advisory — Lapu-Lapu City Center",
        type: "power_outage",
        severity: "critical",
        area: "Lapu-Lapu City/Basak",
        latitude: 10.3103,
        longitude: 124.0144,
        status: "active",
        userId: session.user.id
      },
      {
        title: "Official Maintenance Advisory — Mandaue",
        type: "scheduled_brownout",
        severity: "medium",
        area: "Mandaue City/Subangdaku",
        latitude: 10.3301,
        longitude: 123.9392,
        status: "active",
        userId: session.user.id
      },
      {
        title: "Unscheduled Power Outage near IT Park Lahug",
        type: "power_outage",
        severity: "high",
        area: "Cebu City/Lahug",
        latitude: 10.328,
        longitude: 123.905,
        status: "active",
        userId: session.user.id
      },
      {
        title: "Low Voltage Anomaly in Banilad",
        type: "voltage_fluctuation",
        severity: "medium",
        area: "Cebu City/Banilad",
        latitude: 10.342,
        longitude: 123.912,
        status: "active",
        userId: session.user.id
      },
      {
        title: "Fallen Pole blocking Cordova Access Road",
        type: "fallen_pole",
        severity: "high",
        area: "Cordova/Poblacion",
        latitude: 10.252,
        longitude: 123.948,
        status: "active",
        userId: session.user.id
      },
      {
        title: "Power Restored in Guadalupe Block 4",
        type: "power_outage",
        severity: "low",
        area: "Cebu City/Guadalupe",
        latitude: 10.321,
        longitude: 123.882,
        status: "restored",
        userId: session.user.id
      }
    ];

    const created = await Promise.all(
      seedIncidents.map(incident => prisma.incident.create({ data: incident }))
    );
    
    return NextResponse.json(created);
  } catch (error) {
    console.error("Seed incidents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
