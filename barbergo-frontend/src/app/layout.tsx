import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ToastProvider } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://barbergo.tn"),
  title: {
    default: "BarberGo | Premium At-Home Grooming",
    template: "%s | BarberGo",
  },
  description:
    "Book trusted mobile barbers and hairdressers, manage appointments, and run a polished at-home grooming workflow across Tunisia.",
  keywords: ["barber", "hairdresser", "home service", "Tunisia", "booking", "grooming"],
  openGraph: {
    title: "BarberGo | Premium At-Home Grooming",
    description:
      "Trusted mobile barbers and hairdressers, concierge booking, and a cleaner experience for clients and professionals.",
    siteName: "BarberGo",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="flex min-h-screen flex-col bg-background font-body text-foreground grain">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
