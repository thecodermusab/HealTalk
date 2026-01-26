import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import AppFooter from "@/components/layout/AppFooter";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const lastik = localFont({
  src: [
    {
      path: "../../public/fonts/Lastik-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-logo",
  fallback: ["Georgia", "serif"],
});

const switzer = localFont({
  src: [
    {
      path: "../../public/fonts/Switzer-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Switzer-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Switzer-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Switzer-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "HealTalk - Professional Mental Health Support",
  description: "Connect with licensed psychologists from the comfort of your home. Professional mental health support, whenever you need it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lastik.variable} ${switzer.variable} font-sans antialiased`} suppressHydrationWarning>
        <SessionProvider>
          {children}
          <AppFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
