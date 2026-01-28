"use client";

import { Calendar, MessageCircle, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Book Appointment",
    icon: Calendar,
    href: "/find-psychologists",
    color: "text-[#5B6CFF]",
    bg: "bg-[#EEF0FF]",
    desc: "Find a specialist"
  },
  {
    label: "Send Message",
    icon: MessageCircle,
    href: "/patient/dashboard/messages",
    color: "text-[#20C997]",
    bg: "bg-[#E6F8F3]",
    desc: "Chat with doctor"
  },
  {
    label: "View Favorites",
    icon: Heart,
    href: "/patient/dashboard/favorites",
    color: "text-[#FF9F43]",
    bg: "bg-[#FFF5EB]",
    desc: "Saved doctors"
  },
];

export function PatientQuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {actions.map((action, i) => (
        <Link 
          key={i} 
          href={action.href}
          className="bg-white rounded-[16px] border border-[#E6EAF2] p-5 shadow-[0_8px_24px_rgba(17,24,39,0.02)] hover:shadow-[0_8px_24px_rgba(17,24,39,0.06)] transition-all group flex flex-col justify-between h-[220px]"
        >
          <div className="flex items-start justify-between">
             <div className={cn("w-10 h-10 rounded-[10px] flex items-center justify-center", action.bg)}>
               <action.icon size={20} className={action.color} />
             </div>
             <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#5B6CFF] transition-colors">
                <ArrowRight size={14} className="text-gray-400 group-hover:text-white" />
             </div>
          </div>
          
          <div>
            <h3 className="text-gray-900 text-lg font-bold mb-1">{action.label}</h3>
            <p className="text-gray-500 text-xs">{action.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
