"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Calendar, 
  MessageCircle, 
  Heart, 
  TrendingUp, 
  CreditCard, 
  Settings,
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { href: "/patient/dashboard", icon: Home, label: "Home" },
  { href: "/patient/dashboard/appointments", icon: Calendar, label: "Appointments" },
  { href: "/patient/dashboard/messages", icon: MessageCircle, label: "Messages" },
  { href: "/patient/dashboard/favorites", icon: Heart, label: "Favorites" },
  { href: "/patient/dashboard/progress", icon: TrendingUp, label: "My Progress" },
  { href: "/patient/dashboard/payments", icon: CreditCard, label: "Payments" },
  { href: "/patient/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-white fixed left-0 top-20 bottom-0 overflow-y-auto">
          {/* User Profile Section */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="text-primary" size={24} />
              </div>
              <div>
                <div className="font-semibold text-foreground">John Doe</div>
                <div className="text-sm text-text-secondary">Patient</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/patient/dashboard" && pathname?.startsWith(item.href));
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-foreground hover:bg-background"
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-text-secondary hover:text-foreground"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
