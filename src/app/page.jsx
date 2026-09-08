import Link from "next/link";
import Image from "next/image";

const features = [
  {
    title: "Live Outage Map",
    desc: "See active outages, brownouts, and transformer incidents across Metro Cebu in real time.",
  },
  {
    title: "Community Reports",
    desc: "Residents pin outages on the map with precise locations, descriptions, and severity.",
  },
  {
    title: "Grid Analytics",
    desc: "Up-to-date statistics and trends for the regions served by MECO and VECO.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-foreground flex flex-col">
      {/* Top bar with login/signup on the right */}
      <header className="w-full bg-primary text-primary-foreground">
        <div className="mx-auto w-full max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/dimetrixLogo.svg"
              alt="Dimetrix Logo"
              width={80}
              height={40}
              className="w-20 h-10 object-contain"
            />
            <span className="wallpoet-regular text-2xl tracking-wider text-white">
              DIMETRIX
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 h-11 rounded-full font-hero font-bold text-sm text-white/90 hover:text-white border border-white/30 hover:border-white/60 transition-colors grid place-items-center"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-5 h-11 rounded-full font-hero font-bold text-sm bg-white text-primary hover:bg-white/90 transition-colors grid place-items-center"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 flex-[2] flex flex-col items-center justify-center text-center pt-16 pb-4">
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-black font-hero font-bold mb-6">
          Cebu · Power Watch
        </p>
        <h1 className="wallpoet-regular font-normal text-6xl sm:text-8xl md:text-9xl tracking-wider text-primary leading-none mb-6">
          DIMETRIX
        </h1>
        <p className="max-w-xl font-hero text-base sm:text-lg text-foreground/70 leading-relaxed">
          Real-time power outage tracking for Metro Cebu, Lapu-Lapu City, and Mactan Island.
          See what's down, when it's coming back, and how it affects your grid.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-10">
          <Link
            href="/register"
            className="px-8 h-12 rounded-full bg-primary text-primary-foreground font-hero font-bold text-sm hover:bg-primary/90 transition-colors grid place-items-center min-w-[180px]"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 h-12 rounded-full border border-foreground/20 text-foreground font-hero font-bold text-sm hover:bg-foreground/5 transition-colors grid place-items-center min-w-[180px]"
          >
            Track an Outage
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 flex-1">
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-foreground/10">
          {features.map(({ title, desc }) => (
            <div
              key={title}
              className="p-6 flex-1 text-center"
            >
              <h3 className="font-hero font-bold text-foreground text-sm mb-1.5">{title}</h3>
              <p className="font-hero text-sm text-foreground/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
