import Link from "next/link";
import { Zap, MapPin, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Live Outage Map",
    desc: "See active outages, brownouts, and transformer incidents across Metro Cebu in real time.",
  },
  {
    icon: Zap,
    title: "Community Reports",
    desc: "Residents pin outages on the map with precise locations, descriptions, and severity.",
  },
  {
    icon: BarChart3,
    title: "Grid Analytics",
    desc: "Up-to-date statistics and trends for the regions served by MECO and VECO.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-accent text-accent-foreground bg-[radial-gradient(circle_at_70%_10%,rgba(220,38,38,0.18),transparent_40%)] flex flex-col">
      {/* Top bar with login/signup on the right */}
      <header className="mx-auto w-full max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-foreground">
            <Zap className="w-5 h-5" strokeWidth={2.5} />
          </span>
          <span className="font-brand text-2xl tracking-wider text-white">DIMETRIX</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 h-11 rounded-xl font-hero font-bold text-sm text-white/80 hover:text-white border border-white/15 hover:border-white/30 transition-colors grid place-items-center"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-5 h-11 rounded-xl font-hero font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors grid place-items-center"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 flex-1 flex flex-col items-center justify-center text-center py-16">
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-red-500 font-hero font-bold mb-6">
          Cebu · Power Watch
        </p>
        <h1 className="font-brand text-6xl sm:text-8xl md:text-9xl tracking-wider text-white leading-none mb-6">
          DIMETRIX
        </h1>
        <p className="max-w-xl font-hero text-base sm:text-lg text-white/70 leading-relaxed">
          Real-time power outage tracking for Metro Cebu, Lapu-Lapu City, and Mactan Island.
          See what's down, when it's coming back, and how it affects your grid.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-10">
          <Link
            href="/register"
            className="px-8 h-12 rounded-xl bg-primary text-primary-foreground font-hero font-bold text-sm hover:bg-primary/90 transition-colors grid place-items-center min-w-[180px]"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 h-12 rounded-xl border border-white/20 text-white font-hero font-bold text-sm hover:bg-white/5 transition-colors grid place-items-center min-w-[180px]"
          >
            Track an Outage
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <Icon className="w-6 h-6 text-red-500 mb-3" strokeWidth={2} />
            <h3 className="font-hero font-bold text-white text-sm mb-1.5">{title}</h3>
            <p className="font-hero text-sm text-white/60 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center font-hero text-xs text-white/40">
        Map tiles © OpenStreetMap contributors · Icons by Lucide
      </footer>
    </main>
  );
}
