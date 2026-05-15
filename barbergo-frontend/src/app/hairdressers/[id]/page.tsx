"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/toaster";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Availability, HairdresserResponse, Service } from "@/types";

interface HairdresserDetail extends HairdresserResponse {
  services?: Service[];
  availabilities?: Availability[];
}

const carePromises = [
  "Booking stays attached to the provider profile.",
  "Selected services, address, and slot live in one summary.",
  "Client dashboard handles post-booking follow-up.",
];

export default function HairdresserProfilePage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const [hairdresser, setHairdresser] = useState<HairdresserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profile, services, availabilities] = await Promise.all([
          fetchAPI<HairdresserResponse>(`/hairdressers/${id}`),
          fetchAPI<Service[]>(`/hairdressers/${id}/services`),
          fetchAPI<Availability[]>(`/hairdressers/${id}/availabilities`),
        ]);

        setHairdresser({
          ...profile,
          services: services || [],
          availabilities: availabilities || [],
        });
      } catch {
        toast("Failed to load profile.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, toast]);

  const toggleService = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((item) => item !== serviceId) : [...prev, serviceId]
    );
  };

  const handleBooking = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast("Please sign in before confirming the booking.", "info");
      router.push("/login");
      return;
    }

    if (selectedServices.length === 0) {
      toast("Select at least one service first.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const bookingDateTime = `${bookingDate}T${bookingTime}:00`;

      await fetchAPI("/bookings", {
        method: "POST",
        body: JSON.stringify({
          hairdresserId: Number(id),
          address,
          bookingDate: bookingDateTime,
          serviceIds: selectedServices,
        }),
      });

      toast("Booking confirmed. Redirecting to your dashboard.", "success");
      router.push("/dashboard/client");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create booking.";
      toast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.1fr_0.9fr] lg:px-8">
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (!hairdresser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="font-heading text-4xl font-semibold text-stone-50">Professional not found.</p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-400">
          The profile may have been removed or is temporarily unavailable. Return to the directory to continue
          browsing available professionals.
        </p>
        <button
          type="button"
          onClick={() => router.push("/hairdressers")}
          className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
        >
          <ArrowLeft className="size-4" />
          Back to directory
        </button>
      </div>
    );
  }

  const selectedServiceDetails =
    hairdresser.services?.filter((service) => selectedServices.includes(service.id)) || [];
  const totalPrice = selectedServiceDetails.reduce((sum, service) => sum + Number(service.price), 0);
  const totalDuration = selectedServiceDetails.reduce(
    (sum, service) => sum + Number(service.durationMinutes || 0),
    0
  );
  const canSubmit =
    selectedServiceDetails.length > 0 && Boolean(bookingDate && bookingTime && address) && !submitting;

  const formatDayLabel = (day: string) => day.charAt(0) + day.slice(1).toLowerCase();

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-stone-800/70">
        <div className="soft-grid pointer-events-none absolute inset-0 opacity-25" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <button
            type="button"
            onClick={() => router.push("/hairdressers")}
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-400 transition-colors hover:text-stone-100"
          >
            <ArrowLeft className="size-4" />
            Back to directory
          </button>

          <div className="mt-6 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {hairdresser.validatedByAdmin && (
                  <Badge variant="success">Verified professional</Badge>
                )}
                <Badge variant="outline">At-home service flow</Badge>
              </div>

              <h1 className="mt-5 font-heading text-5xl font-bold leading-tight text-stone-50 sm:text-6xl">
                {hairdresser.fullName}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-relaxed text-stone-300 sm:text-lg">
                {hairdresser.bio ||
                  "Professional mobile barber dedicated to cleaner service delivery, flexible scheduling, and a premium at-home experience."}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-stone-800/80 bg-stone-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-stone-500">Rating</p>
                  <p className="mt-3 flex items-center gap-2 text-2xl font-semibold text-stone-100">
                    <Star className="size-5 fill-amber-400 text-amber-400" />
                    {hairdresser.averageRating?.toFixed(1) || "New"}
                  </p>
                </div>
                <div className="rounded-3xl border border-stone-800/80 bg-stone-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-stone-500">Specialty</p>
                  <p className="mt-3 text-2xl font-semibold text-stone-100">
                    {hairdresser.specialty || "General grooming"}
                  </p>
                </div>
                <div className="rounded-3xl border border-stone-800/80 bg-stone-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-stone-500">Availability</p>
                  <p className="mt-3 text-2xl font-semibold text-stone-100">
                    {hairdresser.availabilities?.length || 0} weekly slot
                    {hairdresser.availabilities?.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>

            <div className="luxury-panel rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-amber-200/70">
                <Sparkles className="size-3.5" />
                Booking overview
              </div>
              <p className="mt-4 font-heading text-3xl font-semibold text-stone-50">
                Build the appointment in one pass.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-stone-300">
                Pick services, reserve the slot, and keep the full context attached to the same provider and job.
              </p>

              <div className="mt-6 grid gap-3">
                {carePromises.map((item) => (
                  <div key={item} className="rounded-3xl border border-stone-800/80 bg-stone-950/60 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2">
                        <CheckCircle2 className="size-4 text-amber-300" />
                      </div>
                      <p className="text-sm leading-relaxed text-stone-300">{item}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#booking-form"
                className={cn(buttonVariants(), "mt-6 w-full justify-center")}
              >
                Start booking
              </a>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleBooking} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[0.8fr_1.1fr_0.9fr]">
          <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <Card className="overflow-hidden border-stone-800/80 bg-stone-950/80">
              <CardHeader className="text-center">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-2xl font-semibold text-amber-300">
                  {hairdresser.fullName?.charAt(0) || "B"}
                </div>
                <CardTitle className="text-2xl">{hairdresser.fullName}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2 text-sm">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {hairdresser.averageRating?.toFixed(1) || "New"}
                  <span className="text-stone-600">•</span>
                  {hairdresser.specialty || "General grooming"}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-stone-800/80 bg-stone-950/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CalendarDays className="size-5 text-amber-300" />
                  Weekly availability
                </CardTitle>
                <CardDescription>Slots declared by the professional.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {hairdresser.availabilities && hairdresser.availabilities.length > 0 ? (
                  hairdresser.availabilities.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/70 px-4 py-3 text-sm"
                    >
                      <span className="font-medium text-stone-200">{formatDayLabel(slot.dayOfWeek)}</span>
                      <span className="text-stone-400">
                        {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-relaxed text-stone-500">No availability has been published yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-stone-800/80 bg-stone-950/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShieldCheck className="size-5 text-amber-300" />
                  What this flow covers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {carePromises.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-stone-400">
                    <CheckCircle2 className="mt-0.5 size-4 text-amber-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

          <div id="booking-form" className="space-y-6">
            <Card className="border-stone-800/80 bg-stone-950/80">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">Select services</CardTitle>
                    <CardDescription>Choose one or more services for this appointment.</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {selectedServiceDetails.length} service{selectedServiceDetails.length === 1 ? "" : "s"} selected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {hairdresser.services && hairdresser.services.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {hairdresser.services.map((service) => {
                      const selected = selectedServices.includes(service.id);
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          aria-pressed={selected}
                          className={`rounded-[1.75rem] border p-5 text-left transition-all ${
                            selected
                              ? "border-amber-400/35 bg-amber-500/10 shadow-lg shadow-amber-950/10"
                              : "border-stone-800 bg-stone-900/60 hover:border-stone-700"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex size-6 items-center justify-center rounded-full border ${
                                    selected
                                      ? "border-amber-400 bg-amber-400 text-stone-950"
                                      : "border-stone-600 text-transparent"
                                  }`}
                                >
                                  <Check className="size-4" />
                                </div>
                                <p className="font-heading text-2xl font-semibold text-stone-50">{service.name}</p>
                              </div>
                              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                                {service.description || "At-home appointment prepared through BarberGo."}
                              </p>
                              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-stone-400">
                                <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-3 py-1.5">
                                  <Clock3 className="size-4 text-amber-300" />
                                  {service.durationMinutes} min
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 px-3 py-1.5">
                                  <Scissors className="size-4 text-amber-300" />
                                  {service.genderTarget}
                                </span>
                              </div>
                            </div>
                            <p className="text-xl font-semibold text-amber-300">
                              {Number(service.price).toFixed(2)} TND
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-stone-500">No services have been listed yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-stone-800/80 bg-stone-950/80">
              <CardHeader>
                <CardTitle className="text-2xl">Appointment details</CardTitle>
                <CardDescription>Set the slot and the address for the visit.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="booking-date">Date</Label>
                    <Input
                      id="booking-date"
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingDate}
                      onChange={(event) => setBookingDate(event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booking-time">Time</Label>
                    <Input
                      id="booking-time"
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(event) => setBookingTime(event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-address">Address</Label>
                  <Input
                    id="booking-address"
                    placeholder="10 Avenue Habib Bourguiba, Tunis"
                    required
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="xl:sticky xl:top-28 xl:self-start">
            <Card className="overflow-hidden border-stone-800/80 bg-stone-950/85">
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl">Booking summary</CardTitle>
                <CardDescription>Review everything before confirming.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="rounded-3xl border border-stone-800 bg-stone-900/70 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Selected services</p>
                  {selectedServiceDetails.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {selectedServiceDetails.map((service) => (
                        <div key={service.id} className="flex items-start justify-between gap-3 text-sm">
                          <div>
                            <p className="font-medium text-stone-200">{service.name}</p>
                            <p className="mt-1 text-stone-500">{service.durationMinutes} min</p>
                          </div>
                          <p className="font-medium text-amber-300">{Number(service.price).toFixed(2)} TND</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-stone-500">No services selected yet.</p>
                  )}
                </div>

                <div className="rounded-3xl border border-stone-800 bg-stone-900/70 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Appointment</p>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-stone-300">
                      <CalendarDays className="size-4 text-amber-300" />
                      {bookingDate || "Choose a date"}
                    </div>
                    <div className="flex items-center gap-3 text-stone-300">
                      <Clock3 className="size-4 text-amber-300" />
                      {bookingTime || "Choose a time"}
                    </div>
                    <div className="flex items-center gap-3 text-stone-300">
                      <MapPin className="size-4 text-amber-300" />
                      {address || "Add the service address"}
                    </div>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-100">
                    You can prepare the booking now, but you will need to sign in before confirming it.
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex-col items-stretch gap-4 border-t border-stone-800/80 bg-stone-950/80">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Estimated total</p>
                    <p className="mt-2 font-heading text-4xl font-bold text-stone-50">
                      {totalPrice.toFixed(2)} TND
                    </p>
                  </div>
                  <div className="text-right text-sm text-stone-400">
                    <p>{totalDuration || 0} min</p>
                    <p>{selectedServiceDetails.length} item{selectedServiceDetails.length === 1 ? "" : "s"}</p>
                  </div>
                </div>

                <Button type="submit" size="lg" className="h-14 text-base" disabled={!canSubmit && isAuthenticated ? true : submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 rounded-full border-2 border-stone-950/25 border-t-stone-950 animate-spin" />
                      Processing...
                    </span>
                  ) : isAuthenticated ? (
                    "Confirm booking"
                  ) : (
                    "Sign in to continue"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </form>
    </div>
  );
}
