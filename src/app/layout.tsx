import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import AppFooter from "@/components/layout/AppFooter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PsyConnect - Professional Mental Health Support",
  description: "Connect with licensed psychologists from the comfort of your home. Professional mental health support, whenever you need it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`} suppressHydrationWarning>
        <SessionProvider>
          {children}
          <AppFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
