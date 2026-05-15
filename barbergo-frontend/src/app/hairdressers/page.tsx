import Link from "next/link";
import { ArrowRight, MapPin, Search, ShieldCheck, SlidersHorizontal, Star } from "lucide-react";
import type { HairdresserResponse } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { fetchAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

async function getHairdressers(): Promise<HairdresserResponse[]> {
  try {
    return await fetchAPI<HairdresserResponse[]>("/hairdressers", { cache: "no-store" });
  } catch {
    return [];
  }
}

interface HairdressersPageProps {
  searchParams?: {
    q?: string;
    specialty?: string;
  };
}

export default async function HairdressersPage({ searchParams }: HairdressersPageProps) {
  const hairdressers = await getHairdressers();

  const query = searchParams?.q?.trim().toLowerCase() || "";
  const specialty = searchParams?.specialty?.trim().toLowerCase() || "";

  const specialties = Array.from(
    new Set(
      hairdressers
        .map((pro) => pro.specialty?.trim())
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b));

  const filteredHairdressers = hairdressers.filter((pro) => {
    const searchableText = [pro.fullName, pro.specialty, pro.bio].filter(Boolean).join(" ").toLowerCase();
    const matchesQuery = !query || searchableText.includes(query);
    const matchesSpecialty = !specialty || pro.specialty?.toLowerCase() === specialty;
    return matchesQuery && matchesSpecialty;
  });

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-stone-800/70">
        <div className="soft-grid pointer-events-none absolute inset-0 opacity-25" />
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
          <div>
            <span className="eyebrow">Professional directory</span>
            <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold text-stone-50 sm:text-5xl">
              Find the right at-home barber for the job.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-300">
              Browse available profiles, narrow the list by specialty, and move into booking with cleaner
              context than a generic listing page.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <Badge variant="warning">Verified onboarding flow</Badge>
              <Badge variant="outline">Role-based dashboards</Badge>
              <Badge variant="outline">Booking-ready profiles</Badge>
            </div>
          </div>

          <div className="luxury-panel rounded-[2rem] p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-amber-200/70">
              <SlidersHorizontal className="size-3.5" />
              Refine the list
            </div>

            <form method="GET" className="mt-5 space-y-4">
              <div className="space-y-2">
                <label htmlFor="directory-query" className="text-sm font-medium text-stone-200">
                  Search by name, specialty, or profile text
                </label>
                <Input
                  id="directory-query"
                  name="q"
                  defaultValue={searchParams?.q || ""}
                  placeholder="Example: fade, beard, bridal styling"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="directory-specialty" className="text-sm font-medium text-stone-200">
                  Specialty
                </label>
                <Select id="directory-specialty" name="specialty" defaultValue={searchParams?.specialty || ""}>
                  <option value="">All specialties</option>
                  {specialties.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" className="flex-1">
                  <Search className="size-4" />
                  Apply filters
                </Button>
                <Link
                  href="/hairdressers"
                  className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
                >
                  Reset
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Results</p>
            <p className="mt-2 text-lg text-stone-200">
              {filteredHairdressers.length} professional{filteredHairdressers.length === 1 ? "" : "s"} shown
              {query || specialty ? ` from ${hairdressers.length}` : ""}
            </p>
          </div>
          {(query || specialty) && (
            <Link href="/hairdressers" className="text-sm font-medium text-amber-300 transition-colors hover:text-amber-200">
              Clear filters
            </Link>
          )}
        </div>

        {filteredHairdressers.length === 0 ? (
          <div className="luxury-panel rounded-[2rem] p-10 text-center">
            <Search className="mx-auto size-10 text-stone-600" />
            <p className="mt-5 text-xl font-semibold text-stone-100">No professionals match these filters.</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-400">
              Try a broader search term, remove the specialty filter, or reset the directory to see all
              available profiles.
            </p>
            <Link href="/hairdressers" className={cn(buttonVariants(), "mt-6 inline-flex")}>
              Show all professionals
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredHairdressers.map((pro) => (
              <Card
                key={pro.id}
                className="overflow-hidden border-stone-800/80 bg-stone-950/75 transition-all hover:-translate-y-1 hover:border-amber-400/25 hover:shadow-2xl hover:shadow-black/25"
              >
                <CardHeader className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-14 border border-amber-500/20 shadow-lg bg-amber-500/10">
                        {pro.profilePicture && (
                          <AvatarImage src={`http://localhost:8121${pro.profilePicture}`} alt={pro.fullName} className="object-cover" />
                        )}
                        <AvatarFallback className="bg-transparent text-lg font-semibold text-amber-300">
                          {pro.fullName?.charAt(0) || "B"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h2 className="truncate font-heading text-2xl font-semibold text-stone-50">
                          {pro.fullName}
                        </h2>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-stone-400">
                          <span className="inline-flex items-center gap-1">
                            <Star className="size-4 fill-amber-400 text-amber-400" />
                            {pro.averageRating?.toFixed(1) || "New"}
                          </span>
                          {pro.specialty && (
                            <span className="rounded-full border border-stone-800 px-2.5 py-1 text-xs uppercase tracking-[0.22em] text-stone-400">
                              {pro.specialty}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {pro.validatedByAdmin && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-emerald-300">
                        <ShieldCheck className="size-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <p className="text-sm leading-relaxed text-stone-400">
                    {pro.bio ||
                      "Professional mobile barber ready to deliver a cleaner at-home service experience."}
                  </p>

                  <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-stone-500">
                      <MapPin className="size-3.5 text-amber-300" />
                      Service mode
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-stone-300">
                      Home-visit booking flow with profile, services, and scheduling handled inside BarberGo.
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-stone-800/80 bg-stone-950/80">
                  <Link
                    href={`/hairdressers/${pro.id}`}
                    className={cn(buttonVariants(), "w-full justify-between")}
                  >
                    View profile
                    <ArrowRight className="size-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
