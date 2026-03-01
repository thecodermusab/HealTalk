"use client";

import { usePathname } from "next/navigation";
import CTAFooterShell from "@/components/layout/CTAFooterShell";
import Footer from "@/components/layout/Footer";

export default function AppFooter() {
  const pathname = usePathname();
  const normalizedPathname =
    pathname && pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const isDashboard = pathname?.includes("/dashboard") ?? false;
  const isHome = normalizedPathname === "/";
  const hideFooterOnRoute = normalizedPathname === "/resources/blog";

  if (isDashboard || hideFooterOnRoute) {
    return null;
  }

  return isHome ? <CTAFooterShell /> : <Footer />;
}
