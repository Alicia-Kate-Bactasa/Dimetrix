"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Map as MapIcon, BarChart3, Megaphone, LogOut, Edit3, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ReportModal from "@/components/ReportModal";
import ProfileModal from "@/components/ProfileModal";

const navItems = [
  { href: "/", label: "Live Map", icon: MapIcon, adminOnly: false },
  { href: "/analytics", label: "Insights", icon: BarChart3, adminOnly: true },
  { href: "/admin", label: "Moderation", icon: ShieldCheck, adminOnly: true }
];

export default function DashboardShell({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = user?.role === "admin";
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/report' || window.location.search.includes('report')) {
      setIsReportModalOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    const handleOpen = () => setIsReportModalOpen(true);
    window.addEventListener("open-report-modal", handleOpen);
    return () => window.removeEventListener("open-report-modal", handleOpen);
  }, []);

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    if (pathname === '/report' || window.location.search.includes('report')) {
      router.replace('/');
    }
  };

  const Header = (
    <header className="sticky top-0 z-[1000] bg-accent text-accent-foreground border-b border-white/10 shadow-md">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 h-20 sm:h-24 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3.5 group">
          <motion.span
            initial={{ rotate: -8, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="relative grid place-items-center w-11 h-11 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30"
          >
            <Zap className="w-6 h-6" strokeWidth={2.5} />
            <span className="absolute inset-0 rounded-2xl ring-2 ring-primary/40 animate-pulse-ring" />
          </motion.span>
          <div className="leading-none space-y-1">
            <span className="block font-brand text-2xl sm:text-3xl tracking-wider text-white font-normal">DIMETRIX</span>
            <span className="block font-body text-[10px] sm:text-[11px] text-white/60 tracking-[0.2em] uppercase font-normal">Cebu · Power Watch</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1.5 sm:gap-3">
            {visibleNavItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-2.5 px-4 sm:px-5 h-12 rounded-2xl font-hero font-bold text-xs sm:text-sm tracking-wide transition-colors ${
                    isActive ? "text-primary" : "text-white/80 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-2xl bg-white/10 shadow-inner"
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Report Modal Trigger Button in Nav */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className={`relative flex items-center gap-2.5 px-4 sm:px-5 h-12 rounded-2xl font-hero font-bold text-xs sm:text-sm tracking-wide transition-colors ${
                isReportModalOpen ? "text-primary bg-white/10" : "text-white/80 hover:text-white"
              }`}
            >
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Report</span>
            </button>
          </nav>

          {/* User Profile Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen((v) => !v)}
              title="User Profile"
              className="flex items-center gap-2.5 px-3.5 h-12 rounded-2xl text-white bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white font-hero font-bold text-xs flex items-center justify-center shadow-md">
                {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0,2) : 'AB'}
              </div>
              <span className="hidden md:inline font-hero font-bold text-xs">{user?.full_name || 'Alicia Bactasa'}</span>
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-14 z-[1200] w-64 rounded-2xl bg-accent border border-white/10 p-3 shadow-2xl space-y-2">
                <div className="p-2 border-b border-white/10">
                  <p className="font-hero font-bold text-sm text-white">{user?.full_name || 'Alicia Bactasa'}</p>
                  <p className="font-body text-[11px] text-white/60 truncate">{user?.email || 'alicia@dimetrix.io'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-hero font-bold bg-primary/20 text-primary border border-primary/30">
                      {user?.role || 'Admin'}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-hero font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Community Member
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-hero font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-primary" /> View & Edit Profile
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      router.push("/admin");
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-hero font-bold text-amber-400 hover:bg-amber-500/10 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> Admin & Moderation
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-hero font-bold text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-white/10 pt-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {Header}
      <main className="flex-1">
        {children}
      </main>

      {/* Global Report Modal */}
      <ReportModal isOpen={isReportModalOpen} onClose={handleCloseReportModal} />

      {/* Global Profile Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}
