"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Globe } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuToggle } from "@/components/ui/menu-toggle";
import { cn } from "@/lib/utils";

export function SimpleHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const links = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Find Psychologists",
      href: "/find-psychologists",
    },
    {
      label: "About",
      href: "/about",
    },
  ];

  const isAuthenticated = status === "authenticated";
  const role = (session?.user as { role?: string } | undefined)?.role;
  const dashboardHref = role === "ADMIN"
    ? "/admin/dashboard"
    : role === "PSYCHOLOGIST"
      ? "/psychologist/dashboard"
      : "/patient/dashboard";

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/find-psychologists") {
      return pathname === "/find-psychologists" || pathname.startsWith("/psychologist/");
    }
    return pathname === href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav className="mx-auto flex h-16 sm:h-[72px] w-full max-w-[1400px] items-center justify-between gap-4 rounded-full bg-white px-6 sm:px-10 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-200/50">
          {/* Brand Logo - Left */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-2xl sm:text-3xl font-serif font-normal text-gray-900 tracking-tight">
              PsyConnect
            </span>
          </Link>

          {/* Navigation Links - Center (Desktop) */}
          <div className="hidden lg:flex items-center justify-center gap-8 flex-1 px-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-[15px] font-medium text-gray-900 hover:text-gray-600 transition-colors duration-200 relative",
                  "after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-gray-900 after:scale-x-0 after:transition-transform after:duration-200",
                  "hover:after:scale-x-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded-sm",
                  isLinkActive(link.href) && "after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Globe Icon Button */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              aria-label="Language selector"
            >
              <Globe className="w-5 h-5 text-gray-700" />
            </button>

            {/* Book a Call / Auth Buttons */}
            {isAuthenticated ? (
              <Link href={dashboardHref}>
                <Button className="h-11 px-6 rounded-full bg-[#d4f567] text-gray-900 font-semibold text-[15px] hover:bg-[#c8e957] transition-colors duration-200 shadow-none border-0 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button className="h-11 px-6 rounded-full bg-[#d4f567] text-gray-900 font-semibold text-[15px] hover:bg-[#c8e957] transition-colors duration-200 shadow-none border-0 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                  Book a call
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-3">
            {/* CTA Button (Mobile - visible) */}
            {isAuthenticated ? (
              <Link href={dashboardHref}>
                <Button className="h-10 px-5 rounded-full bg-[#d4f567] text-gray-900 font-semibold text-sm hover:bg-[#c8e957] transition-colors duration-200 shadow-none border-0">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button className="h-10 px-5 rounded-full bg-[#d4f567] text-gray-900 font-semibold text-sm hover:bg-[#c8e957] transition-colors duration-200 shadow-none border-0">
                  Book a call
                </Button>
              </Link>
            )}

            {/* Hamburger Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 text-gray-900 hover:bg-gray-100"
                aria-label="Open menu"
              >
                <MenuToggle
                  strokeWidth={2.5}
                  open={open}
                  onOpenChange={setOpen}
                  className="size-6"
                />
              </Button>
              <SheetContent
                className="bg-white gap-0 border-l border-gray-200"
                showClose={false}
                side="left"
              >
                <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      className={cn(
                        "px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors",
                        isLinkActive(link.href) && "bg-gray-100"
                      )}
                      href={link.href}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {!isAuthenticated && (
                    <Link
                      href="/login"
                      className="px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
