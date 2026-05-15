import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone, Scissors, ShieldCheck } from "lucide-react";

const quickLinks = [
  { href: "/hairdressers", label: "Browse professionals" },
  { href: "/login", label: "Sign in" },
  { href: "/register", label: "Create account" },
];

const serviceNotes = [
  "Haircuts, fades, and styling",
  "Beard shaping and grooming",
  "Flexible at-home scheduling",
  "Client and professional dashboards",
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-800/80 bg-stone-950/90">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.7fr_0.7fr_0.85fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                <Scissors className="size-5 text-amber-400" />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-stone-50">BarberGo</p>
                <p className="text-[0.68rem] uppercase tracking-[0.32em] text-stone-500">
                  Home grooming concierge
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-stone-400">
              BarberGo connects clients with trusted mobile barbers and hairdressers, turning booking,
              scheduling, and follow-up into one polished experience.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-stone-400">
                <ShieldCheck className="size-3.5 text-amber-400" />
                Verified profiles
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-stone-400">
                <Clock3 className="size-3.5 text-amber-400" />
                Flexible slots
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-300">
              Navigation
            </h4>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-sm text-stone-400 transition-colors hover:text-stone-100"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-300">
              Product
            </h4>
            <div className="space-y-2">
              {serviceNotes.map((item) => (
                <p key={item} className="text-sm text-stone-400">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-stone-300">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-amber-400" />
                Tunis, Tunisia
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-amber-400" />
                +216 XX XXX XXX
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-amber-400" />
                contact@barbergo.tn
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-stone-800/70 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BarberGo. Built for premium at-home grooming.</p>
          <p>Designed for fast booking, verified professionals, and cleaner operations.</p>
        </div>
      </div>
    </footer>
  );
}
