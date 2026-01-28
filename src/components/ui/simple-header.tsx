"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuToggle } from "@/components/ui/menu-toggle";
import { cn } from "@/lib/utils";

export function SimpleHeader() {
  const [open, setOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { data: session, status } = useSession();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <header className="w-full fixed top-[22px] z-[9999] flex justify-center px-4">
      <nav
        className={cn(
          "flex items-center justify-between rounded-[16px] bg-white/95 backdrop-blur-sm pr-2 sm:pr-4", // Adjusted padding, removed default gap
          "transition-shadow duration-300",
          "pl-[30px]", // Exact 30px left padding for logo group
          isScrolled ? "shadow-lg" : "shadow-md"
        )}
        style={{
          width: '947px',
          maxWidth: '100%',
          height: '78px',
        }}
      >
          {/* Brand Logo - Left */}
          <Link href="/" className="flex items-center shrink-0 gap-0"> {/* gap-0 for no space */}
            <img
              src="/images/New_Logo.png"
              alt="HealTalk logo"
              className="h-8 sm:h-10 w-auto"
            />
          </Link>

          {/* Navigation Links - Center (Desktop) */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4" style={{ gap: '27px' }}> {/* Exact 27px gap */}
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-[15px] font-medium text-gray-900 transition-all duration-200 px-4 py-2 rounded-[20px]",
                  "hover:bg-[#dcd5cb]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
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
                <Link href="/onboarding/step-1">
                  <Button className="h-11 px-6 rounded-full bg-[#d5f567] text-black font-semibold text-[15px] hover:bg-[#c3e555] transition-colors duration-200 shadow-none border-0 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-3">
            {/* CTA Button (Mobile - visible) */}
            {isAuthenticated ? (
              <Link href={dashboardHref}>
                <Button className="h-10 px-5 rounded-full bg-[#d5f567] text-black font-semibold text-sm hover:bg-[#c3e555] transition-colors duration-200 shadow-none border-0">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/onboarding/step-1">
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
                        "px-4 py-3 text-base font-medium text-gray-900 rounded-lg transition-colors",
                        "hover:bg-[#dcd5cb]"
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
                      className="px-4 py-3 text-base font-medium text-gray-900 hover:bg-[#dcd5cb] rounded-lg transition-colors"
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
    </header>
  );
}
