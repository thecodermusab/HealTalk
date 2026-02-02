"use client";

import { Search, Bell, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

interface NewHeaderProps {
    onMobileMenuClick: () => void;
}

const roleLabels = {
  PATIENT: "Patient",
  PSYCHOLOGIST: "Psychologist",
  ADMIN: "Administrator",
};

const splitName = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(" ").filter(Boolean);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  const lastName = parts.pop() || "";
  return { firstName: parts.join(" "), lastName };
};

const getInitials = (firstName: string, lastName: string) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();
  return initials ? initials.toUpperCase() : "U";
};

export function NewHeader({ onMobileMenuClick }: NewHeaderProps) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const userName = session?.user?.name || session?.user?.email || "User";
  const { firstName, lastName } = splitName(userName);
  const userRole = session?.user?.role || "PATIENT";
  const roleLabel = roleLabels[userRole as keyof typeof roleLabels] || "User";

  useEffect(() => {
    const loadUnread = async () => {
      try {
        const res = await fetch("/api/messages/unread");
        if (!res.ok) return;
        const data = await res.json();
        setUnreadCount(Number(data?.count || 0));
      } catch (error) {
        setUnreadCount(0);
      }
    };

    loadUnread();
    const interval = setInterval(loadUnread, 30000);
    return () => clearInterval(interval);
  }, []);

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
           {unreadCount > 0 && (
             <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center border border-white">
               {unreadCount > 99 ? "99+" : unreadCount}
             </span>
           )}
        </Button>

        {/* Profile Block */}
        <div className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-100">
           <Avatar className="w-10 h-10 border border-gray-100">
             <AvatarImage src={session?.user?.image || undefined} />
             <AvatarFallback className="bg-[#5B6CFF] text-white">
               {getInitials(firstName, lastName)}
             </AvatarFallback>
           </Avatar>
           <div className="flex flex-col">
             <span className="text-sm font-semibold text-gray-900 leading-none">{userName}</span>
             <span className="text-xs text-gray-500 mt-1">{roleLabel}</span>
           </div>
        </div>
      </div>
    </header>
  );
}
