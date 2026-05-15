"use client";

import { useRouter } from "next/navigation";
import { ClientBookingFlow } from "@/components/dashboard/ClientBookingFlow";

export default function ClientBook() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-heading text-3xl font-bold text-stone-50">
          Book an <span className="text-gradient-gold">Appointment</span>
        </h1>
        <p className="text-stone-400 mt-1">Find a professional and schedule your next visit.</p>
      </div>

      <ClientBookingFlow onSuccess={() => {
        router.push("/client");
      }} />
    </div>
  );
}
