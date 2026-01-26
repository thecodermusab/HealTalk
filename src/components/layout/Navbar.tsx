"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/find-psychologists", label: "Find Psychologists" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                isScrolled
                  ? "bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20"
                  : "bg-white/10 backdrop-blur-sm border border-white/20"
              }`}>
                <Brain
                  className={`w-6 h-6 transition-all duration-500 ${
                    isScrolled ? "text-white" : "text-white"
                  }`}
                  strokeWidth={2.5}
                />
              </div>
              <span className={`text-xl sm:text-2xl font-bold transition-all duration-500 ${
                isScrolled ? "text-foreground" : "text-white drop-shadow-lg"
              }`}>
                PsyConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 text-sm lg:text-base font-medium rounded-lg transition-all duration-300 relative group ${
                      isScrolled
                        ? isActive
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-primary/5"
                        : isActive
                          ? "text-white bg-white/20 backdrop-blur-sm"
                          : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                    }`}
                  >
                    {link.label}
                    <span className={`absolute bottom-1 left-4 right-4 h-0.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? isScrolled ? "bg-primary" : "bg-white"
                        : "bg-transparent group-hover:bg-current"
                    }`}></span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className={`transition-all duration-500 ${
                    isScrolled
                      ? "text-primary hover:bg-primary/10 hover:text-primary"
                      : "text-white hover:bg-white/20 hover:text-white border border-white/20 backdrop-blur-sm"
                  }`}
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className={`transition-all duration-500 shadow-lg ${
                    isScrolled
                      ? "bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                      : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 text-white"
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? "hover:bg-primary/10 text-foreground"
                  : "hover:bg-white/10 text-white backdrop-blur-sm border border-white/20"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-16 sm:top-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-2xl transition-all duration-300 ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="px-4 pt-4 pb-6 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms"
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 space-y-3">
              <Link href="/login" className="block">
                <Button
                  variant="outline"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button
                  className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/30 text-white"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
