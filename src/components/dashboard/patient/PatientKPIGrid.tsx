"use client";

import { Users, Calendar, Clock, Activity, Heart, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Sessions",
    value: "14",
    trend: "+2 this month",
    trendUp: true,
    last: "Last month",
    icon: Users,
    color: "text-[#5B6CFF]",
    bg: "bg-[#EEF0FF]",
  },
  {
    label: "Next Appointment",
    value: "Feb 14",
    trend: "2:00 PM",
    trendUp: true,
    last: "in 2 days",
    icon: Calendar,
    color: "text-[#20C997]",
    bg: "bg-[#E6F8F3]",
  },
  {
    label: "Psychologists",
    value: "3",
    trend: "Active",
    trendUp: true,
    last: "Specialists",
    icon: Heart,
    color: "text-[#FF9F43]",
    bg: "bg-[#FFF5EB]",
  },
  {
    label: "Minutes Spent",
    value: "840",
    trend: "+60m",
    trendUp: true,
    last: "vs Last month",
    icon: Clock,
    color: "text-[#FF6B6B]",
    bg: "bg-[#FFEEEE]",
  },
  {
    label: "Mood Entry",
    value: "Good",
    trend: "Stable",
    trendUp: true,
    last: "Last 7 days",
    icon: Activity,
    color: "text-[#20C997]",
    bg: "bg-[#E6F8F3]",
  },
  {
    label: "Goals Reached",
    value: "85%",
    trend: "+5%",
    trendUp: true,
    last: "Completion",
    icon: Award,
    color: "text-[#5B6CFF]",
    bg: "bg-[#EEF0FF]",
  },
];

export function PatientKPIGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-white rounded-[16px] border border-[#E6EAF2] p-5 shadow-[0_8px_24px_rgba(17,24,39,0.02)] hover:shadow-[0_8px_24px_rgba(17,24,39,0.06)] transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
             <div className={cn("w-10 h-10 rounded-[10px] flex items-center justify-center", stat.bg)}>
               <stat.icon size={20} className={stat.color} />
             </div>
          </div>
          
          <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
          
          <div className="flex items-end justify-between">
             <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
             <div className="flex items-center gap-1 text-xs">
               <span className="text-gray-400">{stat.last}</span>
               {stat.trend && (
                   <span className={cn(
                     "font-medium px-1.5 py-0.5 rounded",
                     stat.trendUp ? "text-[#20C997] bg-[#E6F8F3]" : "text-[#FF6B6B] bg-[#FFEEEE]"
                   )}>
                     {stat.trend}
                   </span>
               )}
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
