"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push(isAdminRoute ? "/admin/login" : "/login");
      return;
    }

    if (isAdminRoute && role !== "ADMIN") {
      router.push("/admin/login");
    }
  }, [isAdminRoute, role, router, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (isAdminRoute && role !== "ADMIN") {
    return null;
  }

  return <div className="min-h-full">{children}</div>;
}
