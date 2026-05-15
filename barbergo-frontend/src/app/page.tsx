import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const promiseCards = [
  {
    icon: ShieldCheck,
    title: "Verified professionals",
    description: "Profiles, specialties, and service decisions stay visible before the booking starts.",
  },
  {
    icon: CalendarDays,
    title: "Cleaner scheduling",
    description: "Choose services, reserve a slot, and keep the entire appointment flow in one interface.",
  },
  {
    icon: WalletCards,
    title: "Operational clarity",
    description: "Invoices, booking status, and role-based dashboards are already built into the workflow.",
  },
];

const serviceCategories = [
  {
    title: "Sharp cuts and fades",
    detail: "For clients who want a clean result without leaving the house or losing half a day.",
  },
  {
    title: "Beard and grooming rituals",
    detail: "Precise shaping, upkeep, and finishing touches for a more premium mobile service.",
  },
  {
    title: "Flexible recurring care",
    detail: "A booking system that works for one-off sessions and professionals building repeat business.",
  },
];

const experienceSteps = [
  {
    step: "01",
    title: "Choose the right professional",
    description: "Browse specialties, compare profiles, and open the provider page with the context you need.",
  },
  {
    step: "02",
    title: "Build the appointment",
    description: "Pick services, date, time, and address in one booking flow instead of chasing messages.",
  },
  {
    step: "03",
    title: "Track the outcome",
    description: "Status changes, invoices, reviews, and dashboard history all stay attached to the same job.",
  },
];

const professionalBenefits = [
  "Service and availability management",
  "Live status updates during a booking",
  "Cleaner admin validation workflow",
  "Dashboard separation by role",
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-[28rem] w-[28rem] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="soft-grid absolute inset-0 opacity-30" />
      </div>

      <section className="relative">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24 lg:pt-36">
          <div className="flex flex-col justify-center">
            <span className="eyebrow w-fit">
              <Sparkles className="size-3.5" />
              Premium at-home grooming
            </span>

            <h1 className="mt-6 max-w-3xl font-heading text-5xl font-bold leading-[0.95] tracking-tight text-stone-50 sm:text-6xl lg:text-7xl">
              The front desk for modern mobile barbers.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-300 sm:text-xl">
              BarberGo turns discovery, booking, and service operations into one deliberate experience for
              Tunisia-based at-home grooming.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/hairdressers"
                className={cn(buttonVariants({ size: "lg" }), "h-14 px-7 text-base")}
              >
                Browse professionals
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-7 text-base")}
              >
                Join as a professional
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              <Badge variant="warning">Verified profiles</Badge>
              <Badge variant="outline">Client and pro dashboards</Badge>
              <Badge variant="outline">At-home appointments</Badge>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-stone-800/80 bg-stone-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.26em] text-stone-500">Client side</p>
                <p className="mt-3 text-lg font-semibold text-stone-100">Reserve a home visit without the back-and-forth.</p>
              </div>
              <div className="rounded-3xl border border-stone-800/80 bg-stone-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.26em] text-stone-500">Professional side</p>
                <p className="mt-3 text-lg font-semibold text-stone-100">Run services, availability, and active jobs.</p>
              </div>
              <div className="rounded-3xl border border-stone-800/80 bg-stone-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.26em] text-stone-500">Admin side</p>
                <p className="mt-3 text-lg font-semibold text-stone-100">Validate providers and watch platform health.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="luxury-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(38_92%_50%_/_0.12),_transparent_44%)]" />

              <div className="relative space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">Booking board</p>
                    <p className="mt-2 font-heading text-3xl font-semibold text-stone-50">
                      Tonight in Tunis
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-300">
                    Active flow
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-stone-800 bg-stone-950/60 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Selected service</p>
                    <p className="mt-3 text-xl font-semibold text-stone-100">Fade + beard line-up</p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-stone-400">
                      <Clock3 className="size-4 text-amber-300" />
                      75-minute mobile session
                    </div>
                  </div>

                  <div className="rounded-3xl border border-stone-800 bg-stone-950/60 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Arrival window</p>
                    <p className="mt-3 text-xl font-semibold text-stone-100">19:30 - 20:00</p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-stone-400">
                      <MapPin className="size-4 text-amber-300" />
                      Downtown Tunis
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-stone-800 bg-stone-950/70 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Provider status</p>
                      <p className="mt-2 text-lg font-semibold text-stone-100">Profile, services, and availability aligned.</p>
                    </div>
                    <div className="rounded-full bg-amber-500/10 p-3">
                      <Scissors className="size-5 text-amber-300" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Trust</p>
                      <p className="mt-2 text-sm text-stone-300">Admin-reviewed onboarding</p>
                    </div>
                    <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Flow</p>
                      <p className="mt-2 text-sm text-stone-300">Booking status moves with the appointment</p>
                    </div>
                    <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Closeout</p>
                      <p className="mt-2 text-sm text-stone-300">Invoice and review stay attached to the job</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-stone-400">
                  <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-3 py-1.5">
                    <Star className="size-4 text-amber-300" />
                    Client-facing trust
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-3 py-1.5">
                    <CheckCircle2 className="size-4 text-amber-300" />
                    Professional workflow
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="relative border-y border-stone-800/70 bg-stone-950/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="eyebrow">Why this product feels stronger</span>
            <h2 className="mt-5 font-heading text-4xl font-bold text-stone-50 sm:text-5xl">
              Less friction for the client. Better control for the professional.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {promiseCards.map((item) => (
              <div key={item.title} className="luxury-panel rounded-[1.75rem] p-6">
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 w-fit">
                  <item.icon className="size-5 text-amber-300" />
                </div>
                <h3 className="mt-5 font-heading text-2xl font-semibold text-stone-50">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <span className="eyebrow">Service framing</span>
              <h2 className="mt-5 font-heading text-4xl font-bold text-stone-50 sm:text-5xl">
                A more deliberate front end for real booking behavior.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-400">
                The goal is not to decorate the interface. It is to make every step clearer: discovery,
                service choice, scheduling, and operational follow-up.
              </p>
            </div>

            <div className="grid gap-4">
              {serviceCategories.map((item) => (
                <div key={item.title} className="luxury-divider rounded-[1.75rem] border border-stone-800/80 bg-stone-950/70 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-heading text-2xl font-semibold text-stone-50">{item.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-400">{item.detail}</p>
                    </div>
                    <Link href="/hairdressers" className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition-colors hover:text-amber-200">
                      View providers
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-800/70 bg-stone-950/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">Flow</span>
              <h2 className="mt-5 font-heading text-4xl font-bold text-stone-50 sm:text-5xl">
                Three steps, one continuous system.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-stone-400">
              Each stage is built to support the next one, so the product feels coherent from landing page
              to dashboard.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {experienceSteps.map((item) => (
              <div key={item.step} className="rounded-[1.75rem] border border-stone-800/80 bg-stone-950/70 p-6">
                <p className="text-sm uppercase tracking-[0.32em] text-amber-200/70">{item.step}</p>
                <h3 className="mt-4 font-heading text-2xl font-semibold text-stone-50">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="professionals" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="luxury-panel overflow-hidden rounded-[2rem] p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <span className="eyebrow">For professionals</span>
                <h2 className="mt-5 max-w-2xl font-heading text-4xl font-bold text-stone-50 sm:text-5xl">
                  Join the network with a dashboard that respects the job.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-300">
                  BarberGo is not just a listing page. It gives professionals a structured place to manage
                  service setup, weekly availability, appointment updates, and completed work.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/register"
                    className={cn(buttonVariants({ size: "lg" }), "h-14 px-7 text-base")}
                  >
                    Create professional account
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/hairdressers"
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-7 text-base")}
                  >
                    Explore current directory
                  </Link>
                </div>
              </div>

              <div className="grid gap-3">
                {professionalBenefits.map((item) => (
                  <div key={item} className="rounded-3xl border border-stone-800/80 bg-stone-950/60 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2">
                        <CheckCircle2 className="size-4 text-amber-300" />
                      </div>
                      <p className="text-sm font-medium text-stone-200">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
