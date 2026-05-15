import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Scissors,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Trusted profiles",
    description: "Clients browse vetted professionals with clear specialties and booking context.",
  },
  {
    icon: CalendarDays,
    title: "Cleaner scheduling",
    description: "Appointments, statuses, invoices, and service flow stay in one place.",
  },
  {
    icon: WalletCards,
    title: "Better operations",
    description: "Professionals manage services and availability without patchwork tools.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden pt-28 pb-8 sm:py-12 sm:pt-32">
      <div className="soft-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="absolute left-0 top-32 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="luxury-panel relative order-2 overflow-hidden rounded-[2rem] p-8 lg:order-1 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(38_92%_50%_/_0.12),_transparent_42%)]" />

          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-6">
              <span className="eyebrow">
                <Scissors className="size-3.5" />
                Account access
              </span>

              <div className="space-y-4">
                <h1 className="max-w-xl font-heading text-4xl font-bold leading-tight text-stone-50 sm:text-5xl">
                  A sharper booking experience for clients and professionals.
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-stone-300">
                  BarberGo is designed for premium at-home grooming: quick discovery, cleaner scheduling,
                  and a dashboard that respects how the business actually runs.
                </p>
              </div>

              <div className="grid gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-stone-800/80 bg-stone-950/50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2.5">
                        <item.icon className="size-5 text-amber-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-200">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-stone-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-stone-800/80 bg-stone-950/70 p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-200/70">
                <Sparkles className="size-3.5" />
                Platform rhythm
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Clients</p>
                  <p className="mt-2 text-sm text-stone-300">Discover, compare, and reserve at-home sessions.</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Professionals</p>
                  <p className="mt-2 text-sm text-stone-300">Control services, availability, and job updates.</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Admin</p>
                  <p className="mt-2 text-sm text-stone-300">Validate providers and watch platform activity.</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-stone-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-3 py-1.5">
                  <Clock3 className="size-4 text-amber-300" />
                  Fast booking flow
                </span>
                <Link href="/hairdressers" className="inline-flex items-center gap-2 text-amber-300 transition-colors hover:text-amber-200">
                  Browse professionals
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="order-1 flex items-start justify-center lg:order-2">{children}</div>
      </div>
    </div>
  );
}
