"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  Calendar,
  MessageCircle,
  Heart,
  TrendingUp,
  CreditCard,
  Settings,
  LogOut,
  User,
  Users,
  Building,
  DollarSign,
  FileText,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Role-based navigation items
const navigationConfig = {
  PATIENT: [
    { href: "/patient/dashboard", icon: Home, label: "Home" },
    { href: "/patient/dashboard/appointments", icon: Calendar, label: "Appointments" },
    { href: "/patient/dashboard/messages", icon: MessageCircle, label: "Messages" },
    { href: "/patient/dashboard/favorites", icon: Heart, label: "Favorites" },
    { href: "/patient/dashboard/progress", icon: TrendingUp, label: "My Progress" },
    { href: "/patient/dashboard/payments", icon: CreditCard, label: "Payments" },
    { href: "/patient/dashboard/settings", icon: Settings, label: "Settings" },
  ],
  PSYCHOLOGIST: [
    { href: "/psychologist/dashboard", icon: Home, label: "Home" },
    { href: "/psychologist/dashboard/appointments", icon: Calendar, label: "Appointments" },
    { href: "/psychologist/dashboard/messages", icon: MessageCircle, label: "Messages" },
    { href: "/psychologist/dashboard/patients", icon: Users, label: "Patients" },
    { href: "/psychologist/dashboard/earnings", icon: DollarSign, label: "Earnings" },
    { href: "/psychologist/dashboard/profile", icon: User, label: "Profile" },
  ],
  ADMIN: [
    { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { href: "/admin/dashboard/psychologists", icon: Users, label: "Psychologists" },
    { href: "/admin/dashboard/hospitals", icon: Building, label: "Hospitals" },
    { href: "/admin/dashboard/patients", icon: Users, label: "Patients" },
    { href: "/admin/dashboard/reports", icon: FileText, label: "Reports" },
    { href: "/admin/dashboard/settings", icon: Settings, label: "Settings" },
  ],
};

const roleLabels = {
  PATIENT: "Patient",
  PSYCHOLOGIST: "Psychologist",
  ADMIN: "Administrator",
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
  };

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const userRole = (session?.user as any)?.role || "PATIENT";
  const navigationItems = navigationConfig[userRole as keyof typeof navigationConfig] || navigationConfig.PATIENT;
  const userName = session?.user?.name || "User";
  const roleLabel = roleLabels[userRole as keyof typeof roleLabels] || "User";

  const SidebarContent = () => (
    <>
      {/* User Profile Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="text-primary" size={24} />
          </div>
          <div>
            <div className="font-semibold text-foreground">{userName}</div>
            <div className="text-sm text-text-secondary">{roleLabel}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== `/${userRole.toLowerCase()}/dashboard` && pathname?.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-background"
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
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed left-0 top-0 bottom-0">
          <SidebarContent />
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <User className="text-primary" size={24} />
            <span className="font-semibold text-foreground">{userName}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <aside className="lg:hidden fixed inset-0 top-16 bg-card z-40 flex flex-col border-r border-border">
            <SidebarContent />
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 lg:p-8 pt-24 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
