"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const roleLabels = {
  PATIENT: "Patient",
  PSYCHOLOGIST: "Psychologist",
  ADMIN: "Administrator",
};

const splitName = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(" ").filter(Boolean);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  const lastName = parts.pop() || "";
  return { firstName: parts.join(" "), lastName };
};

const getInitials = (firstName: string, lastName: string) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();
  return initials ? initials.toUpperCase() : "U";
};


const psychologistNavItems = [
  { label: "Dashboard", href: "/psychologist/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/psychologist/dashboard/appointments", icon: CalendarDays },
  { label: "Patients", href: "/psychologist/dashboard/patients", icon: Users },
  { label: "Messages", href: "/psychologist/dashboard/messages", icon: MessageSquare },
  { label: "Report", href: "/psychologist/dashboard/report", icon: BarChart2 },
  { label: "Settings", href: "/psychologist/dashboard/settings", icon: Settings },
];

const patientNavItems = [
  { label: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/patient/dashboard/appointments", icon: CalendarDays },
  { label: "Messages", href: "/patient/dashboard/messages", icon: MessageSquare },
  { label: "Favorites", href: "/patient/dashboard/favorites", icon: Users },
  { label: "Payments", href: "/patient/dashboard/payments", icon: BarChart2 },
  { label: "Settings", href: "/patient/dashboard/settings", icon: Settings },
];

const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Psychologists", href: "/admin/dashboard/psychologists", icon: Users },
  { label: "Hospitals", href: "/admin/dashboard/hospitals", icon: Users },
  { label: "Settings", href: "/admin/dashboard/settings", icon: Settings },
];

export function NewSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isPatient = pathname?.startsWith("/patient");
  const isAdmin = pathname?.startsWith("/admin");
  
  let navItems = psychologistNavItems;
  if (isPatient) navItems = patientNavItems;
  if (isAdmin) navItems = adminNavItems;

  const userName = session?.user?.name || session?.user?.email || "User";
  const { firstName, lastName } = splitName(userName);
  const userRole = session?.user?.role || "PATIENT";
  const roleLabel = roleLabels[userRole as keyof typeof roleLabels] || "User";

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
          const isActive = pathname === item.href || (item.href !== "/psychologist/dashboard" && item.href !== "/patient/dashboard" && item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));
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

      <div className="p-4 border-t border-[#E6EAF2]">
        <div className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarFallback className="bg-[#364a60] text-white font-medium">
              {getInitials(firstName, lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{roleLabel}</p>
          </div>
          <button 
            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
            title="Log Out"
            onClick={() => signOut({ callbackUrl: "/", redirect: true })}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>


    </aside>
  );
}
