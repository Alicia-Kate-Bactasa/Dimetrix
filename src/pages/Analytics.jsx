"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import { Activity, Zap, AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";
import { apiClient } from "@/api/apiClient";
import { INCIDENT_TYPES } from "@/lib/cebuAreas";
import StatCard from "@/components/StatCard";

const MOCK_ANALYTICS_INCIDENTS = [
  {
    id: "inc-101",
    title: "Unscheduled Power Outage in Lahug",
    type: "power_outage",
    status: "active",
    severity: "high",
    area: "Lahug",
    description: "Transformer anomaly near IT Park. Utility crews responding.",
    affected_households: 420,
    verified: true,
    created_date: new Date().toISOString(),
    start_time: new Date().toISOString()
  },
  {
    id: "inc-102",
    title: "Low Voltage Anomaly near Banilad",
    type: "scheduled_brownout",
    status: "ongoing",
    severity: "medium",
    area: "Banilad",
    description: "Brownout reported across residential blocks.",
    affected_households: 180,
    verified: false,
    created_date: new Date(Date.now() - 3600000).toISOString(),
    start_time: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "inc-103",
    title: "Scheduled Maintenance Outage in Mandaue",
    type: "scheduled_brownout",
    status: "scheduled",
    severity: "low",
    area: "Mandaue",
    description: "Substation upgrade work scheduled by power cooperative.",
    affected_households: 1200,
    verified: true,
    created_date: new Date(Date.now() - 7200000).toISOString(),
    start_time: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "inc-104",
    title: "Power Restored in Guadalupe Block 4",
    type: "power_outage",
    status: "restored",
    severity: "low",
    area: "Guadalupe",
    description: "Main line fuse replaced; grid stability restored.",
    affected_households: 250,
    verified: true,
    created_date: new Date(Date.now() - 18000000).toISOString(),
    start_time: new Date(Date.now() - 18000000).toISOString()
  }
];

export default function Analytics() {
  const [incidents, setIncidents] = useState(MOCK_ANALYTICS_INCIDENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (apiClient?.entities?.Incident?.list) {
          const data = await apiClient.entities.Incident.list("-created_date", 500);
          if (data && data.length > 0) {
            setIncidents(data);
          }
        }
      } catch (e) {
        console.warn("Using local mock analytics incidents:", e);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const total = incidents.length;
    const active = incidents.filter((i) => i.status === "active" || i.status === "ongoing").length;
    const verified = incidents.filter((i) => i.verified).length;
    const households = incidents.reduce((sum, i) => sum + (i.affected_households || 0), 0);
    return { total, active, verified, households };
  }, [incidents]);

  const byType = useMemo(() => {
    const map = {};
    incidents.forEach((i) => { map[i.type] = (map[i.type] || 0) + 1; });
    return INCIDENT_TYPES.map((t) => ({ name: t.short, full: t.label, value: map[t.key] || 0, color: t.color }));
  }, [incidents]);

  const byArea = useMemo(() => {
    const map = {};
    incidents.forEach((i) => { map[i.area] = (map[i.area] || 0) + 1; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [incidents]);

  const trend = useMemo(() => {
    const days = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days[key] = 0;
    }
    incidents.forEach((i) => {
      const key = (i.start_time || i.created_date || "").slice(0, 10);
      if (key in days) days[key] += 1;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-PH", { month: "short", day: "numeric" }),
      outages: count
    }));
  }, [incidents]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="font-body text-[11px] tracking-[0.25em] uppercase text-primary font-bold">Insights</p>
        <h1 className="font-hero font-bold tracking-tight text-3xl sm:text-5xl mt-2 leading-[1.05]">
          The pattern behind <span className="text-primary">the dark.</span>
        </h1>
        <p className="font-body text-sm text-muted-foreground mt-3 max-w-xl">
          Every report tells a story. Here's what Cebu's outages look like over time — so we can spot trouble before it spreads.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total reports" value={loading ? "—" : stats.total} icon={Activity} delay={0} />
        <StatCard label="Active now" value={loading ? "—" : stats.active} icon={Zap} accent delay={0.05} />
        <StatCard label="Homes affected" value={loading ? "—" : stats.households.toLocaleString()} icon={AlertTriangle} delay={0.1} />
        <StatCard label="Verified" value={loading ? "—" : stats.verified} icon={ShieldCheck} delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Panel title="Outages by type" subtitle="What's causing the trouble">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byType} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {byType.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tipStyle} />
                <Legend wrapperStyle={{ fontFamily: "Comfortaa", fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="14-day trend" subtitle="Reports per day" icon={TrendingUp}>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="date" tick={{ fontFamily: "Comfortaa", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontFamily: "Comfortaa", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tipStyle} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                <Bar dataKey="outages" fill="#dc2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Most affected areas" subtitle="Where the outages cluster">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byArea} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontFamily: "Comfortaa", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontFamily: "Comfortaa", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tipStyle} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
              <Bar dataKey="value" fill="#0a0a0a" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

const tipStyle = {
  borderRadius: 12,
  border: "1px solid #e5e5e5",
  fontFamily: "Comfortaa",
  fontSize: 12,
  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)"
};

function Panel({ title, subtitle, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-hero font-bold text-lg leading-none text-foreground">{title}</p>
          {subtitle && <p className="font-body text-[11px] text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {Icon && <Icon className="w-5 h-5 text-primary" />}
      </div>
      {children}
    </motion.div>
  );
}