"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users, Building, Calendar, TrendingUp, AlertCircle, CheckCircle, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminDashboardHome() {
  const platformStats = {
    totalPsychologists: 45,
    activePsychologists: 38,
    pendingApprovals: 7,
    totalPatients: 1234,
    activePatients: 892,
    totalHospitals: 12,
    totalAppointments: 3456,
    thisMonthAppointments: 287,
    totalRevenue: 1567890,
    thisMonthRevenue: 128500,
  };

  const recentActivities = [
    {
      id: 1,
      type: "approval",
      text: "Dr. Ayşe Demir approved",
      subtext: "Application reviewed and accepted",
      time: "2 hours ago",
      icon: CheckCircle,
      bg: "bg-[#E6F8F3]",
      color: "text-[#20C997]"
    },
    {
      id: 2,
      type: "registration",
      text: "New hospital added: Memorial Ankara",
      subtext: "Pending verification",
      time: "5 hours ago",
      icon: Building,
      bg: "bg-[#EEF0FF]",
      color: "text-[#5B6CFF]"
    },
    {
      id: 3,
      type: "pending",
      text: "3 psychologists awaiting approval",
      subtext: "Action required",
      time: "Yesterday",
      icon: AlertCircle,
      bg: "bg-[#FFF5EB]",
      color: "text-[#FF9F43]"
    },
  ];

  const topPsychologists = [
    { id: 1, name: "Dr. Ahmet Yılmaz", appointments: 45, rating: 4.8, earnings: 20250 },
    { id: 2, name: "Dr. Ayşe Demir", appointments: 38, rating: 4.9, earnings: 19000 },
    { id: 3, name: "Dr. Mehmet Kaya", appointments: 35, rating: 4.7, earnings: 15750 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/dashboard/psychologists">
            <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 hover:shadow-[0_8px_24px_rgba(17,24,39,0.06)] hover:border-[#5B6CFF] transition-all cursor-pointer group h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center group-hover:bg-[#5B6CFF] transition-colors">
                  <Users className="text-[#5B6CFF] group-hover:text-white transition-colors" size={24} />
                </div>
                {platformStats.pendingApprovals > 0 && (
                  <span className="px-2.5 py-1 bg-[#FFF5EB] text-[#FF9F43] text-xs font-bold rounded-full">
                    {platformStats.pendingApprovals} pending
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {platformStats.totalPsychologists}
              </div>
              <div className="text-sm text-gray-500 font-medium">Total Psychologists</div>
              <div className="text-xs text-[#20C997] font-bold mt-2 flex items-center gap-1">
                <CheckCircle size={12} /> {platformStats.activePsychologists} active
              </div>
            </div>
          </Link>

          <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#E6F8F3] rounded-xl flex items-center justify-center">
                <Users className="text-[#20C997]" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {platformStats.totalPatients.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 font-medium">Total Patients</div>
            <div className="text-xs text-[#20C997] font-bold mt-2 flex items-center gap-1">
               <ArrowUpRight size={12} /> {platformStats.activePatients} active this month
            </div>
          </div>

          <Link href="/admin/dashboard/hospitals">
            <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 hover:shadow-[0_8px_24px_rgba(17,24,39,0.06)] hover:border-[#5B6CFF] transition-all cursor-pointer group h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#F4F7FF] rounded-xl flex items-center justify-center group-hover:bg-[#5B6CFF] transition-colors">
                  <Building className="text-[#5B6CFF] group-hover:text-white transition-colors" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {platformStats.totalHospitals}
              </div>
              <div className="text-sm text-gray-500 font-medium">Partner Hospitals</div>
            </div>
          </Link>

          <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#FFF5EB] rounded-xl flex items-center justify-center">
                <Calendar className="text-[#FF9F43]" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {platformStats.totalAppointments.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 font-medium">Total Appointments</div>
            <div className="text-xs text-[#20C997] font-bold mt-2 flex items-center gap-1">
               <ArrowUpRight size={12} /> {platformStats.thisMonthAppointments} this month
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-[#5B6CFF] to-[#8090FF] rounded-[24px] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <TrendingUp size={32} className="text-white" />
                </div>
                <div>
                <div className="text-blue-100 font-medium mb-1">Total Platform Revenue</div>
                <div className="text-4xl font-bold">₺{platformStats.totalRevenue.toLocaleString()}</div>
                </div>
            </div>
            
            <div className="flex items-center gap-10 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/10">
                <div>
                <div className="text-blue-100 text-sm mb-1">This Month</div>
                <div className="text-2xl font-bold">₺{platformStats.thisMonthRevenue.toLocaleString()}</div>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div>
                <div className="text-blue-100 text-sm mb-1">Growth</div>
                <div className="text-2xl font-bold flex items-center gap-1">
                    +12.5% <ArrowUpRight size={20} />
                </div>
                </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Psychologists */}
          <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-gray-900">Top Psychologists</h3>
                 <span className="text-xs font-bold text-[#5B6CFF] bg-[#EEF0FF] px-2 py-1 rounded">This Month</span>
            </div>
            <div className="space-y-4">
              {topPsychologists.map((psy, index) => (
                <div key={psy.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-[#EEF0FF] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#5B6CFF] transition-colors">
                    <span className="font-bold text-[#5B6CFF] group-hover:text-white">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{psy.name}</div>
                    <div className="text-xs text-gray-500 font-medium">
                      {psy.appointments} appointments • <span className="text-[#FF9F43]">{psy.rating} ★</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₺{psy.earnings.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">earnings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", activity.bg)}>
                    <activity.icon className={activity.color} size={18} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="text-sm font-bold text-gray-900">{activity.text}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{activity.subtext}</div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium whitespace-nowrap pt-1">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
