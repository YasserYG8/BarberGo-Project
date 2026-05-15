"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import {
  LayoutDashboard,
  CalendarPlus,
  History,
  UserCog,
  Scissors,
  Clock,
  Users,
  CalendarCheck,
  UserCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { user } = useAuthStore();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) return null;

  let links: { name: string; href: string; icon: React.ReactNode }[] = [];

  if (user.role === "CLIENT") {
    links = [
      { name: "Overview", href: "/client", icon: <LayoutDashboard className="size-5 shrink-0" /> },
      { name: "Make a Booking", href: "/client/book", icon: <CalendarPlus className="size-5 shrink-0" /> },
      { name: "History", href: "/client/history", icon: <History className="size-5 shrink-0" /> },
      { name: "Profile Settings", href: "/client/profile", icon: <UserCog className="size-5 shrink-0" /> },
    ];
  } else if (user.role === "HAIRDRESSER") {
    links = [
      { name: "Overview", href: "/hairdresser", icon: <LayoutDashboard className="size-5 shrink-0" /> },
      { name: "Services", href: "/hairdresser/services", icon: <Scissors className="size-5 shrink-0" /> },
      { name: "Availability", href: "/hairdresser/availability", icon: <Clock className="size-5 shrink-0" /> },
      { name: "Profile Settings", href: "/hairdresser/profile", icon: <UserCog className="size-5 shrink-0" /> },
    ];
  } else if (user.role === "ADMIN") {
    links = [
      { name: "Overview", href: "/admin", icon: <LayoutDashboard className="size-5 shrink-0" /> },
      { name: "Professionals", href: "/admin/professionals", icon: <Users className="size-5 shrink-0" /> },
      { name: "Recent Bookings", href: "/admin/bookings", icon: <CalendarCheck className="size-5 shrink-0" /> },
      { name: "Registered Users", href: "/admin/users", icon: <UserCircle className="size-5 shrink-0" /> },
    ];
  }

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button onClick={toggleMobileMenu} size="icon" className="h-14 w-14 rounded-full shadow-2xl bg-amber-600 hover:bg-amber-500 border-none">
          {isMobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </div>

      {/* Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-stone-950/80 backdrop-blur-xl border-r border-stone-800 transition-all duration-300 ease-in-out md:sticky md:top-[5rem] md:h-[calc(100vh-5rem)] ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4 py-6 overflow-x-hidden">
            <div className={`mb-8 px-2 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
              {!isCollapsed && (
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 truncate">
                  {user.role} Menu
                </h2>
              )}
            </div>
            
            <nav className="space-y-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    title={isCollapsed ? link.name : undefined}
                    className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        : "text-stone-400 hover:bg-stone-800/50 hover:text-stone-200 border border-transparent"
                    }`}
                  >
                    {link.icon}
                    {!isCollapsed && <span className="truncate">{link.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Toggle Button */}
          <div className="hidden md:flex border-t border-stone-800 p-4 justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
