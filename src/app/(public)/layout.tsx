import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import AppFooter from "@/components/layout/AppFooter";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <AppFooter />
    </>
  );
}
