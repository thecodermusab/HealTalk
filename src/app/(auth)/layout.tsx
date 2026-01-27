import { ReactNode } from "react";
import AppFooter from "@/components/layout/AppFooter";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="w-full flex justify-center pt-8">
        <Link href="/" className="inline-flex items-center">
          <img
            src="/images/New_Logo.png"
            alt="HealTalk logo"
            className="h-8 w-auto"
          />
        </Link>
      </div>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <AppFooter />
    </div>
  );
}
