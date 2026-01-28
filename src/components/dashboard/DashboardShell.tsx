"use client";

import { ReactNode, useState } from "react";
import { NewSidebar } from "@/components/dashboard/NewSidebar";
import { NewHeader } from "@/components/dashboard/NewHeader";

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F8FF] font-sans">
      <div className="flex">
        {/* Fixed Desktop Sidebar */}
        <NewSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
          
          {/* Top Header */}
          <NewHeader onMobileMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

          {/* Page Content */}
          <main className="p-6 md:p-8">
             {children}
          </main>
        </div>
      </div>
      
      {/* Mobile Drawer (Simplistic for now, to match scope) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden font-sans">
           <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
           <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-white z-50 overflow-y-auto">
             {/* Re-using sidebar logic or components for mobile would go here */}
             <div className="p-6">
                <h2 className="font-bold text-xl mb-6 text-[#5B6CFF]">HealTalk.</h2>
                <p className="text-gray-500">Mobile menu content...</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
