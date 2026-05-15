"use client";

import { HairdresserServices as ServicesManager } from "@/components/dashboard/HairdresserServices";

export default function HairdresserServicesPage() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-heading text-3xl font-bold text-stone-50">
          Your <span className="text-gradient-gold">Services</span>
        </h1>
        <p className="text-stone-400 mt-1">Manage what you offer to clients.</p>
      </div>

      <ServicesManager />
    </div>
  );
}
