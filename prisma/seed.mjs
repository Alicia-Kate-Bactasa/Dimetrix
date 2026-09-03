import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "alicia@dimetrix.io" },
    update: {},
    create: {
      email: "alicia@dimetrix.io",
      name: "Alicia Bactasa",
      password: hashedPassword,
      role: "admin",
      emailVerified: new Date(),
    },
  });

  console.log("Admin user created:", admin.email);

  // Seed incidents
  const incidents = [
    {
      title: "Official Advisory — Lapu-Lapu City Center",
      type: "power_outage",
      status: "active",
      severity: "critical",
      area: "Lapu-Lapu City",
      barangay: "Basak",
      provider: "Mactan Grid",
      sourceType: "official",
      verificationStatus: "official",
      sourceUrl: "https://facebook.com/advisory-2026-09-01",
      description: "Utility crew dispatched for feeder tripoff impacting Basak, Gun-ob, and Pajo. Estimated restoration: 3 hours.",
      affectedHouseholds: 2800,
      verified: true,
      confirmationsCount: 34,
      latitude: 10.3103,
      longitude: 124.0144,
      userId: admin.id,
    },
    {
      title: "Official Maintenance Advisory — Mandaue Industrial Sector",
      type: "scheduled_brownout",
      status: "scheduled",
      severity: "medium",
      area: "Mandaue City",
      barangay: "Subangdaku",
      provider: "Metro Grid",
      sourceType: "official",
      verificationStatus: "official",
      sourceUrl: "https://advisories.local/mandaue-sep04",
      description: "Scheduled distribution line maintenance along A.S. Fortuna St corridor from 9:00 AM to 5:00 PM.",
      affectedHouseholds: 1550,
      verified: true,
      confirmationsCount: 18,
      latitude: 10.3301,
      longitude: 123.9392,
      userId: admin.id,
    },
    {
      title: "Unscheduled Power Outage near IT Park Lahug",
      type: "power_outage",
      status: "active",
      severity: "high",
      area: "Cebu City",
      barangay: "Lahug",
      provider: "Metro Grid",
      sourceType: "community",
      verificationStatus: "verified",
      reporterName: "Alicia Bactasa",
      description: "Sparks observed on pole transformer near Salinas Drive entrance. Entire block out of power.",
      affectedHouseholds: 420,
      verified: true,
      confirmationsCount: 14,
      latitude: 10.328,
      longitude: 123.905,
      userId: admin.id,
    },
    {
      title: "Low Voltage Anomaly in Banilad Residential Area",
      type: "voltage_fluctuation",
      status: "ongoing",
      severity: "medium",
      area: "Cebu City",
      barangay: "Banilad",
      provider: "Metro Grid",
      sourceType: "community",
      verificationStatus: "unverified",
      reporterName: "Neighbor User",
      description: "Frequent brownout flickers and line voltage dropping below 180V across 3 street blocks.",
      affectedHouseholds: 180,
      verified: false,
      confirmationsCount: 5,
      latitude: 10.342,
      longitude: 123.912,
      userId: admin.id,
    },
    {
      title: "Fallen Pole blocking Cordova Access Road",
      type: "fallen_pole",
      status: "active",
      severity: "high",
      area: "Cordova",
      barangay: "Poblacion",
      provider: "Mactan Grid",
      sourceType: "community",
      verificationStatus: "verified",
      reporterName: "Barangay Watch",
      description: "Utility pole leaned over roadway following heavy gust. Emergency hotline notified.",
      affectedHouseholds: 310,
      verified: true,
      confirmationsCount: 9,
      latitude: 10.252,
      longitude: 123.948,
      userId: admin.id,
    },
    {
      title: "Power Restored in Guadalupe Block 4",
      type: "power_outage",
      status: "restored",
      severity: "low",
      area: "Cebu City",
      barangay: "Guadalupe",
      provider: "Metro Grid",
      sourceType: "community",
      verificationStatus: "verified",
      reporterName: "Resident Mod",
      description: "Main line fuse replaced; grid stability restored.",
      affectedHouseholds: 250,
      verified: true,
      confirmationsCount: 8,
      latitude: 10.321,
      longitude: 123.882,
      userId: admin.id,
    },
  ];

  for (const inc of incidents) {
    await prisma.incident.create({ data: inc });
  }

  console.log(`Seeded ${incidents.length} incidents`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
