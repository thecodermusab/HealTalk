"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
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
            <img
              src="/images/logo.png"
              alt="HealTalk logo"
              className="h-8 sm:h-10 w-auto brightness-0 saturate-100"
              style={{ filter: 'invert(88%) sepia(46%) saturate(549%) hue-rotate(21deg) brightness(103%) contrast(95%)' }}
            />
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
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Link href={dashboardHref}>
                <Button className="h-11 px-6 rounded-full bg-[#d5f567] text-black font-semibold text-[15px] hover:bg-[#c3e555] transition-colors duration-200 shadow-none border-0 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button className="h-11 px-6 rounded-full bg-white text-black font-medium text-[15px] hover:bg-gray-100 transition-colors duration-200 shadow-none border border-gray-300 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="h-11 px-6 rounded-full bg-[#d5f567] text-black font-semibold text-[15px] hover:bg-[#c3e555] transition-colors duration-200 shadow-none border-0 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Mobile Language Switcher */}
            <LanguageSwitcher />
            {/* CTA Button (Mobile - visible) */}
            {isAuthenticated ? (
              <Link href={dashboardHref}>
                <Button className="h-10 px-5 rounded-full bg-[#d5f567] text-black font-semibold text-sm hover:bg-[#c3e555] transition-colors duration-200 shadow-none border-0">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button className="h-10 px-5 rounded-full bg-[#d5f567] text-black font-semibold text-sm hover:bg-[#c3e555] transition-colors duration-200 shadow-none border-0">
                  Get Started
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
