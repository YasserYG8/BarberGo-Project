"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Scissors,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const navLinks = [
  { href: "/hairdressers", label: "Directory" },
  { href: "/#experience", label: "Experience" },
  { href: "/#professionals", label: "For Pros" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.push("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "ADMIN") return "/dashboard/admin";
    if (user.role === "HAIRDRESSER") return "/dashboard/hairdresser";
    return "/dashboard/client";
  };

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const showAuth = mounted && isAuthenticated;
  const isDashboardRoute = pathname.startsWith("/client") || pathname.startsWith("/admin") || pathname.startsWith("/hairdresser") || pathname.startsWith("/dashboard");
  const navBackground = scrolled || isDashboardRoute
    ? "border-b border-stone-800/70 bg-stone-950/80 backdrop-blur-xl"
    : "bg-transparent";

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navBackground}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 shadow-lg shadow-amber-950/25">
              <Scissors className="size-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="font-heading text-2xl font-bold tracking-tight text-stone-50">
                BarberGo
              </p>
              <p className="text-[0.68rem] uppercase tracking-[0.32em] text-stone-500">
                Home grooming concierge
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center rounded-full border border-stone-800/70 bg-stone-950/60 px-2 py-2 backdrop-blur-xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  isActiveLink(link.href)
                    ? "bg-stone-800 text-stone-100"
                    : "text-stone-400 hover:text-stone-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 rounded-full border border-stone-800/70 px-3 py-2 text-xs uppercase tracking-[0.26em] text-stone-400">
              <ShieldCheck className="size-3.5 text-amber-400" />
              Verified at-home professionals
            </div>

            {showAuth ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/80 px-4 py-2 text-sm font-medium text-stone-200 transition-colors hover:border-stone-700 hover:text-stone-50"
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-3 rounded-full border border-stone-800 bg-stone-950/75 py-1.5 pl-2.5 pr-1.5">
                  {user?.profilePicture ? (
                    <img
                      src={`http://localhost:8121${user.profilePicture}`}
                      alt={user.fullName}
                      className="size-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-9 items-center justify-center rounded-full bg-amber-500/10 text-sm font-semibold text-amber-300">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="hidden 2xl:block pr-1">
                    <p className="text-sm font-medium text-stone-200">{user?.fullName}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                      {user?.role}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full p-2 text-stone-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    aria-label="Log out"
                    title="Log out"
                  >
                    <LogOut className="size-4" />
                  </button>
                </div>
              </>
            ) : mounted ? (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-stone-300 transition-colors hover:text-stone-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-900/20 transition-all hover:bg-amber-400"
                >
                  Start booking
                  <ArrowUpRight className="size-4" />
                </Link>
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden rounded-2xl border border-stone-800 bg-stone-950/70 p-3 text-stone-300 backdrop-blur-xl transition-colors hover:text-stone-50"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-stone-800/70 bg-stone-950/92 px-4 pb-5 pt-4 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-7xl space-y-4">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">
                Mobile grooming
              </p>
              <p className="mt-2 text-sm leading-relaxed text-stone-300">
                Browse vetted professionals, reserve a slot, and manage your booking from one place.
              </p>
            </div>

            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-2xl px-4 py-3 text-sm transition-colors ${
                    isActiveLink(link.href)
                      ? "bg-stone-800 text-stone-50"
                      : "text-stone-300 hover:bg-stone-900 hover:text-stone-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {showAuth ? (
              <div className="rounded-3xl border border-stone-800 bg-stone-900/70 p-4">
                <div className="mb-4 flex items-center gap-3">
                  {user?.profilePicture ? (
                    <img
                      src={`http://localhost:8121${user.profilePicture}`}
                      alt={user.fullName}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10 font-semibold text-amber-300">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-100">{user?.fullName}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center gap-2 rounded-2xl bg-stone-800 px-4 py-3 text-sm font-medium text-stone-100"
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="size-4" />
                    Log out
                  </button>
                </div>
              </div>
            ) : mounted ? (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block rounded-2xl border border-stone-800 px-4 py-3 text-center text-sm font-medium text-stone-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-stone-950"
                >
                  Start booking
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
