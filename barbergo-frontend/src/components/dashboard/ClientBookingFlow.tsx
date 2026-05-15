"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, MapPin, Scissors, Search, ShieldCheck, Star } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Availability, HairdresserResponse, Service } from "@/types";

interface HairdresserDetail extends HairdresserResponse {
  services?: Service[];
  availabilities?: Availability[];
}

export function ClientBookingFlow({ onSuccess }: { onSuccess: () => void }) {
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const [view, setView] = useState<"directory" | "booking">("directory");
  
  // Directory State
  const [hairdressers, setHairdressers] = useState<HairdresserResponse[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  // Booking State
  const [selectedProId, setSelectedProId] = useState<number | null>(null);
  const [proDetails, setProDetails] = useState<HairdresserDetail | null>(null);
  const [proReviews, setProReviews] = useState<any[]>([]);
  const [proLoading, setProLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [clientGenderFilter, setClientGenderFilter] = useState<"BOTH" | "MALE" | "FEMALE">("BOTH");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [address, setAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Directory
  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const data = await fetchAPI<HairdresserResponse[]>("/hairdressers", { cache: "no-store" });
        setHairdressers(data || []);
      } catch {
        toast("Failed to load directory", "error");
      } finally {
        setDirectoryLoading(false);
      }
    };
    fetchDirectory();
  }, [toast]);

  // Fetch Pro Details when selected
  useEffect(() => {
    if (view === "booking" && selectedProId) {
      setProLoading(true);
      const fetchProfile = async () => {
        try {
          const [profile, services, availabilities, reviews] = await Promise.all([
            fetchAPI<HairdresserResponse>(`/hairdressers/${selectedProId}`),
            fetchAPI<Service[]>(`/hairdressers/${selectedProId}/services`),
            fetchAPI<Availability[]>(`/hairdressers/${selectedProId}/availabilities`),
            fetchAPI<any[]>(`/hairdressers/${selectedProId}/reviews`).catch(() => []), // Fallback to empty array if endpoint fails
          ]);

          setProDetails({
            ...profile,
            services: services || [],
            availabilities: availabilities || [],
          });
          setProReviews(reviews || []);
        } catch {
          toast("Failed to load professional details.", "error");
          setView("directory");
        } finally {
          setProLoading(false);
        }
      };
      fetchProfile();
    }
  }, [view, selectedProId, toast]);

  const specialties = Array.from(
    new Set(
      hairdressers
        .map((pro) => pro.specialty?.trim())
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b));

  const filteredHairdressers = hairdressers.filter((pro) => {
    const searchableText = [pro.fullName, pro.specialty, pro.bio].filter(Boolean).join(" ").toLowerCase();
    const matchesQuery = !query || searchableText.includes(query.toLowerCase());
    const matchesSpecialty = !specialtyFilter || pro.specialty?.toLowerCase() === specialtyFilter.toLowerCase();
    return matchesQuery && matchesSpecialty;
  });

  const handleSelectPro = (id: number) => {
    setSelectedProId(id);
    setSelectedServices([]);
    setBookingDate("");
    setBookingTime("");
    setAddress("");
    setView("booking");
  };

  const handleBackToDirectory = () => {
    setView("directory");
    setSelectedProId(null);
    setProDetails(null);
  };

  const toggleService = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((item) => item !== serviceId) : [...prev, serviceId]
    );
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast("Geolocation is not supported by your browser", "error");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error("Failed to fetch address");
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
            toast("Location retrieved successfully!", "success");
          } else {
            toast("Could not determine address from location", "error");
          }
        } catch (error) {
          toast("Error fetching address details", "error");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        toast("Unable to retrieve your location. Please ensure location permissions are granted.", "error");
        setIsLocating(false);
      }
    );
  };

  const handleBookingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast("Please sign in before confirming the booking.", "info");
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
          hairdresserId: selectedProId,
          address,
          bookingDate: bookingDateTime,
          serviceIds: selectedServices,
        }),
      });

      toast("Booking confirmed successfully!", "success");
      onSuccess(); // Switch back to Overview tab
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create booking.";
      toast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (view === "directory") {
    return (
      <div className="space-y-6 animate-slide-up">
        {/* Directory Header & Filters */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-stone-50 mb-2">Find a Professional</h2>
            <p className="text-stone-400">Browse and book verified barbers in your area.</p>
          </div>
          <div className="flex gap-3 flex-col sm:flex-row w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
              <Input 
                placeholder="Search name or style..." 
                className="pl-9 w-full sm:w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <option value="">All Specialties</option>
              {specialties.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>
          </div>
        </div>

        {directoryLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <CardSkeleton /><CardSkeleton /><CardSkeleton />
          </div>
        ) : filteredHairdressers.length === 0 ? (
          <div className="luxury-panel rounded-[2rem] p-10 text-center">
            <Search className="mx-auto size-10 text-stone-600" />
            <p className="mt-5 text-xl font-semibold text-stone-100">No professionals match these filters.</p>
            <Button variant="outline" className="mt-6" onClick={() => { setQuery(""); setSpecialtyFilter(""); }}>
              Clear Filters
            </Button>
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
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-stone-400 line-clamp-2">
                    {pro.bio || "Professional mobile barber ready to deliver a cleaner at-home service experience."}
                  </p>
                </CardContent>
                <CardFooter className="border-t border-stone-800/80 bg-stone-950/80 p-4">
                  <Button
                    onClick={() => handleSelectPro(pro.id)}
                    className="w-full justify-between"
                  >
                    Select & Book
                    <ArrowRight className="size-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Booking View
  if (proLoading || !proDetails) {
    return (
      <div className="space-y-6 animate-slide-up">
        <Button variant="ghost" onClick={handleBackToDirectory} className="mb-4">
          <ArrowLeft className="size-4 mr-2" /> Back to directory
        </Button>
        <CardSkeleton />
      </div>
    );
  }

  // Filter services by gender
  const availableServices = proDetails.services?.filter(
    (service) => service.genderTarget === "BOTH" || clientGenderFilter === "BOTH" || service.genderTarget === clientGenderFilter
  ) || [];

  const selectedServiceDetails = availableServices.filter((service) => selectedServices.includes(service.id));
  const totalPrice = selectedServiceDetails.reduce((sum, service) => sum + Number(service.price), 0);
  const totalDuration = selectedServiceDetails.reduce((sum, service) => sum + Number(service.durationMinutes || 0), 0);
  const canSubmit = selectedServiceDetails.length > 0 && Boolean(bookingDate && bookingTime && address) && !submitting;

  return (
    <div className="space-y-8 animate-slide-up">
      <Button variant="outline" onClick={handleBackToDirectory}>
        <ArrowLeft className="size-4 mr-2" /> Back to Directory
      </Button>

      {/* Improved Header for the Pro */}
      <div className="flex flex-col md:flex-row gap-6 items-center bg-stone-900/40 p-6 rounded-3xl border border-stone-800">
        <Avatar className="size-24 border-4 border-amber-500/20 bg-amber-500/10 shadow-xl">
          {proDetails.profilePicture && (
            <AvatarImage src={`http://localhost:8121${proDetails.profilePicture}`} alt={proDetails.fullName} className="object-cover" />
          )}
          <AvatarFallback className="bg-transparent text-4xl font-semibold text-amber-300">
            {proDetails.fullName?.charAt(0) || "B"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="font-heading text-3xl font-bold text-stone-50">{proDetails.fullName}</h1>
            {proDetails.validatedByAdmin && (
              <ShieldCheck className="size-5 text-emerald-400" />
            )}
          </div>
          <p className="text-stone-400 max-w-xl mx-auto md:mx-0">{proDetails.bio || "Professional mobile barber."}</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4 border-r border-stone-700">
            <p className="text-stone-500 text-xs uppercase tracking-widest">Rating</p>
            <p className="flex items-center gap-1 text-xl font-bold text-stone-100 mt-1">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {proDetails.averageRating?.toFixed(1) || "New"}
            </p>
          </div>
          <div className="text-center px-4">
            <p className="text-stone-500 text-xs uppercase tracking-widest">Specialty</p>
            <p className="text-xl font-bold text-stone-100 mt-1">{proDetails.specialty || "General"}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleBookingSubmit} className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left Col: Services & Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Select Services</CardTitle>
                <CardDescription>Choose one or more services for this appointment.</CardDescription>
              </div>
              <Select value={clientGenderFilter} onValueChange={(val: string) => setClientGenderFilter(val as "BOTH" | "MALE" | "FEMALE")}>
                <option value="BOTH">All Services</option>
                <option value="MALE">Men&apos;s Services</option>
                <option value="FEMALE">Women&apos;s Services</option>
              </Select>
            </CardHeader>
            <CardContent>
              {availableServices.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {availableServices.map((service) => {
                    const selected = selectedServices.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={cn(
                          "flex flex-col p-4 text-left rounded-2xl border transition-all duration-200",
                          selected 
                            ? "border-amber-400/50 bg-amber-500/10 shadow-lg shadow-amber-950/20" 
                            : "border-stone-800 hover:border-stone-600 bg-stone-900/50"
                        )}
                      >
                        <div className="flex justify-between w-full mb-2">
                          <h3 className="font-semibold text-lg text-stone-100">{service.name}</h3>
                          <div className={cn("size-5 rounded-full flex items-center justify-center border", selected ? "border-amber-400 bg-amber-400 text-stone-950" : "border-stone-600 text-transparent")}>
                            <Check className="size-3" />
                          </div>
                        </div>
                        <p className="text-amber-400 font-bold mb-3">{Number(service.price).toFixed(2)} TND</p>
                        <div className="mt-auto flex items-center gap-3 text-xs text-stone-400">
                          <span className="flex items-center gap-1 bg-stone-950 px-2 py-1 rounded-md border border-stone-800">
                            <Clock3 className="size-3 text-amber-500" /> {service.durationMinutes} min
                          </span>
                          <span className="flex items-center gap-1 bg-stone-950 px-2 py-1 rounded-md border border-stone-800">
                            <Scissors className="size-3 text-amber-500" /> {service.genderTarget}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-stone-500">
                    No active services found matching your criteria.
                  </p>
                  {clientGenderFilter !== "BOTH" && (
                    <Button variant="link" className="text-amber-500 mt-2" onClick={() => setClientGenderFilter("BOTH")}>
                      View all services
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>When and where do you need the service?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Service Address</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="h-auto p-0 text-amber-500 hover:text-amber-400 hover:bg-transparent"
                  >
                    <MapPin className="mr-1 size-3" />
                    {isLocating ? "Locating..." : "Use current location"}
                  </Button>
                </div>
                <Input
                  required
                  placeholder="10 Avenue Habib Bourguiba, Tunis"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          {proReviews && proReviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
                <CardDescription>What others are saying about {proDetails.fullName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {proReviews.map((review: any) => (
                  <div key={review.id} className="p-4 rounded-xl border border-stone-800 bg-stone-900/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`size-3 ${i < review.rating ? "fill-amber-500" : "text-stone-700"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-stone-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-stone-300 italic">&ldquo;{review.comment}&rdquo;</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Col: Summary */}
        <aside className="lg:sticky lg:top-24 h-max">
          <Card className="border-amber-500/20 bg-stone-950/80 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-xl">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Selected Services</p>
                {selectedServiceDetails.length > 0 ? (
                  <div className="space-y-2">
                    {selectedServiceDetails.map((s) => (
                      <div key={s.id} className="flex justify-between text-sm">
                        <span className="text-stone-300">{s.name}</span>
                        <span className="text-amber-400 font-medium">{Number(s.price).toFixed(2)} TND</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-500 italic">No services selected</p>
                )}
              </div>

              <div className="space-y-3 border-t border-stone-800 pt-4">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Details</p>
                <div className="space-y-2 text-sm text-stone-300">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-amber-500" />
                    {bookingDate || "No date selected"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="size-4 text-amber-500" />
                    {bookingTime || "No time selected"}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-amber-500" />
                    <span className="truncate">{address || "No address provided"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800">
                <div className="flex items-end justify-between">
                  <p className="text-stone-400 text-sm">Estimated Total</p>
                  <p className="font-heading text-3xl font-bold text-stone-50">{totalPrice.toFixed(2)} TND</p>
                </div>
                <p className="text-right text-xs text-stone-500 mt-1">Duration: {totalDuration} min</p>
              </div>
            </CardContent>
            <CardFooter className="relative z-10">
              <Button type="submit" size="lg" className="w-full text-base font-semibold" disabled={!canSubmit}>
                {submitting ? "Processing..." : "Confirm Booking"}
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </form>
    </div>
  );
}
