"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MessageSquare,
  BarChart2,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";


const navItems = [
  { label: "Dashboard", href: "/psychologist/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/psychologist/dashboard/appointments", icon: CalendarDays },
  { label: "Patients", href: "/psychologist/dashboard/patients", icon: Users },
  { label: "Messages", href: "/psychologist/dashboard/messages", icon: MessageSquare },
  { label: "Report", href: "/psychologist/dashboard/report", icon: BarChart2 },
  { label: "Settings", href: "/psychologist/dashboard/settings", icon: Settings },
];

export function NewSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-screen fixed left-0 top-0 bg-white border-r border-[#E6EAF2] flex flex-col z-30 hidden lg:flex">
      {/* Brand */}
      <div className="h-[72px] flex items-center px-6 border-b border-[#E6EAF2]/50">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo Icon mockup */}
          <div className="text-[#5B6CFF] font-bold text-2xl font-sans tracking-tight">
            HealTalk.
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/psychologist/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-[#EEF0FF] text-[#5B6CFF]" 
                  : "text-[#7B8794] hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-[#5B6CFF]" : "text-[#7B8794]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>


    </aside>
  );
}
