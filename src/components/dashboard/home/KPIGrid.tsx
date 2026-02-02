"use client";

import { Users, Calendar, CheckCircle, UserMinus, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppointments } from "@/hooks/useAppointments";

export function KPIGrid() {
  const { appointments } = useAppointments();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "SCHEDULED" &&
      new Date(appointment.startTime) >= now
  ).length;
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "COMPLETED"
  ).length;
  const cancelledAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "CANCELLED" || appointment.status === "NO_SHOW"
  ).length;
  const monthAppointments = appointments.filter((appointment) => {
    if (!appointment.createdAt) return false;
    return new Date(appointment.createdAt) >= startOfMonth;
  }).length;
  const todayAppointments = appointments.filter((appointment) => {
    const startTime = new Date(appointment.startTime);
    return startTime >= startOfDay && startTime < endOfDay;
  }).length;

  const stats = [
    {
      label: "Total Appointments",
      value: `${totalAppointments}`,
      trend: "All time",
      trendUp: true,
      last: "Sessions",
      icon: Users,
      color: "text-[#5B6CFF]",
      bg: "bg-[#EEF0FF]",
    },
    {
      label: "Upcoming Sessions",
      value: `${upcomingAppointments}`,
      trend: "Scheduled",
      trendUp: true,
      last: "Upcoming",
      icon: Calendar,
      color: "text-[#20C997]",
      bg: "bg-[#E6F8F3]",
    },
    {
      label: "This Month",
      value: `${monthAppointments}`,
      trend: "New",
      trendUp: true,
      last: "Appointments",
      icon: Activity,
      color: "text-[#FF9F43]",
      bg: "bg-[#FFF5EB]",
    },
    {
      label: "Cancelled/No-show",
      value: `${cancelledAppointments}`,
      trend: "Total",
      trendUp: false,
      last: "Cancelled",
      icon: UserMinus,
      color: "text-[#FF6B6B]",
      bg: "bg-[#FFEEEE]",
    },
    {
      label: "Completed",
      value: `${completedAppointments}`,
      trend: "All time",
      trendUp: true,
      last: "Sessions",
      icon: CheckCircle,
      color: "text-[#20C997]",
      bg: "bg-[#E6F8F3]",
    },
    {
      label: "Appointments Today",
      value: `${todayAppointments}`,
      trend: "Today",
      trendUp: true,
      last: "Schedule",
      icon: Clock,
      color: "text-[#5B6CFF]",
      bg: "bg-[#EEF0FF]",
    },
  ];

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
               <span className={cn(
                 "font-medium px-1.5 py-0.5 rounded",
                 stat.trendUp ? "text-[#20C997] bg-[#E6F8F3]" : "text-[#FF6B6B] bg-[#FFEEEE]"
               )}>
                 {stat.trend}
               </span>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
