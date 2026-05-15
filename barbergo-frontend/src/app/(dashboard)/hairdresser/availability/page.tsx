"use client";

import { HairdresserAvailability as AvailabilityManager } from "@/components/dashboard/HairdresserAvailability";

export default function HairdresserAvailabilityPage() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-heading text-3xl font-bold text-stone-50">
          Your <span className="text-gradient-gold">Availability</span>
        </h1>
        <p className="text-stone-400 mt-1">Set your working hours and days off.</p>
      </div>

      <AvailabilityManager />
    </div>
  );
}
