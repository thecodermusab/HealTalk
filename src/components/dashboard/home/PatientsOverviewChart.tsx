"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Calendar, Loader2 } from "lucide-react";

interface PatientStats {
  totalPatients: number;
  activePatients: number;
  newThisMonth: number;
  upcomingSessions: number;
}

export function PatientsOverviewChart() {
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [patientsRes, appointmentsRes] = await Promise.all([
          fetch("/api/psychologist/patients"),
          fetch("/api/appointments"),
        ]);

        if (!patientsRes.ok || !appointmentsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const patients = await patientsRes.json();
        const appointments = await appointmentsRes.json();

        // Calculate stats
        const totalPatients = patients.length;
        const activePatients = patients.filter((p: any) => p.upcomingSessions > 0).length;

        // New patients this month (simplified - count patients with first appointment this month)
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newThisMonth = appointments.filter((apt: any) => {
          const createdAt = new Date(apt.createdAt || apt.startTime);
          return createdAt >= firstOfMonth;
        }).length;

        const upcomingSessions = appointments.filter(
          (apt: any) => apt.status === "SCHEDULED"
        ).length;

        setStats({
          totalPatients,
          activePatients,
          newThisMonth,
          upcomingSessions,
        });
      } catch (err) {
        console.error("Error fetching patient stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-gray-900 text-lg">Patients Overview</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </div>
    );
  }

  if (!stats || stats.totalPatients === 0) {
    return (
      <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-gray-900 text-lg">Patients Overview</h3>
        </div>
        <div className="flex-1 min-h-[250px] w-full flex items-center justify-center">
          <div className="text-sm text-gray-500">No patient data yet.</div>
        </div>
      </div>
    );
  }

  const activePercentage = stats.totalPatients > 0
    ? Math.round((stats.activePatients / stats.totalPatients) * 100)
    : 0;

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-gray-900 text-lg">Patients Overview</h3>
      </div>

      <div className="space-y-6 flex-1">
        {/* Total Patients */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        {/* Active Patients */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Active Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activePatients}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">of total</p>
            <p className="text-sm font-bold text-green-600">{activePercentage}%</p>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Calendar size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Upcoming Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingSessions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
