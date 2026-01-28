"use client";

import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NewHeaderProps {
    onMobileMenuClick: () => void;
}

export function NewHeader({ onMobileMenuClick }: NewHeaderProps) {
  return (
    <header className="h-[72px] bg-white border-b border-[#E6EAF2] flex items-center justify-between px-6 sticky top-0 z-20">
      
      {/* Search Bar - Center/Left */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-gray-500"
            onClick={onMobileMenuClick}
        >
            <Menu size={24} />
        </Button>
        
        <div className="relative w-full max-w-[320px] hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search" 
            className="pl-10 h-11 rounded-full border-[#E6EAF2] bg-white text-sm placeholder:text-gray-400 focus-visible:ring-[#5B6CFF] focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Button size="icon" variant="ghost" className="rounded-full w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100 relative">
           <Bell size={18} />
           <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </Button>

        {/* Profile Block */}
        <div className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-100">
           <Avatar className="w-10 h-10 border border-gray-100">
             <AvatarImage src="/images/Me.png" />
             <AvatarFallback className="bg-[#5B6CFF] text-white">DY</AvatarFallback>
           </Avatar>
           <div className="flex flex-col">
             <span className="text-sm font-semibold text-gray-900 leading-none">Dr. Ahmet Yılmaz</span>
             <span className="text-xs text-gray-500 mt-1">Psychotherapist</span>
           </div>
        </div>
      </div>
    </header>
  );
}
