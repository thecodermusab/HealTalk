"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users, Building, Calendar, TrendingUp, CheckCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardHome() {
  const [metrics, setMetrics] = useState({
    totalPsychologists: 0,
    activePsychologists: 0,
    pendingApprovals: 0,
    totalPatients: 0,
    activePatients: 0,
    totalHospitals: 0,
    totalAppointments: 0,
    thisMonthAppointments: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/metrics");
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.error || "Failed to load metrics.");
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        setError("Failed to load metrics.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">Platform overview and management</p>
          {isLoading && (
            <p className="text-sm text-gray-400 mt-2">Loading metrics...</p>
          )}
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/dashboard/psychologists">
            <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 hover:shadow-[0_8px_24px_rgba(17,24,39,0.06)] hover:border-[#5B6CFF] transition-all cursor-pointer group h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#EEF0FF] rounded-xl flex items-center justify-center group-hover:bg-[#5B6CFF] transition-colors">
                  <Users className="text-[#5B6CFF] group-hover:text-white transition-colors" size={24} />
                </div>
                {metrics.pendingApprovals > 0 && (
                  <span className="px-2.5 py-1 bg-[#FFF5EB] text-[#FF9F43] text-xs font-bold rounded-full">
                    {metrics.pendingApprovals} pending
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {metrics.totalPsychologists}
              </div>
              <div className="text-sm text-gray-500 font-medium">Total Psychologists</div>
              <div className="text-xs text-[#20C997] font-bold mt-2 flex items-center gap-1">
                <CheckCircle size={12} /> {metrics.activePsychologists} active
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
              {metrics.totalPatients.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 font-medium">Total Patients</div>
            <div className="text-xs text-[#20C997] font-bold mt-2 flex items-center gap-1">
               <ArrowUpRight size={12} /> {metrics.activePatients} active this month
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
                {metrics.totalHospitals}
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
              {metrics.totalAppointments.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 font-medium">Total Appointments</div>
            <div className="text-xs text-[#20C997] font-bold mt-2 flex items-center gap-1">
               <ArrowUpRight size={12} /> {metrics.thisMonthAppointments} this month
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
                <div className="text-4xl font-bold">₺{(metrics.totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
            </div>

            <div className="flex items-center gap-10 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/10">
                <div>
                <div className="text-blue-100 text-sm mb-1">This Month</div>
                <div className="text-2xl font-bold">₺{(metrics.thisMonthRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div>
                <div className="text-blue-100 text-sm mb-1">Growth</div>
                <div className="text-2xl font-bold flex items-center gap-1">
                    {metrics.totalRevenue ? "+0%" : "—"} <ArrowUpRight size={20} />
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
            <div className="py-10 text-center text-sm text-gray-500">
              No top psychologists yet.
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="py-10 text-center text-sm text-gray-500">
              No recent activity yet.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
