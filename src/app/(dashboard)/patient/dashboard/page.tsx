"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { PatientUpcomingAppointments } from "@/components/dashboard/patient/PatientUpcomingAppointments";
import { PatientQuickActions } from "@/components/dashboard/patient/PatientQuickActions";
import { PatientRecentActivity } from "@/components/dashboard/patient/PatientRecentActivity";
import { PatientNextAppointmentCard } from "@/components/dashboard/patient/PatientNextAppointmentCard";

export default function PatientDashboardHome() {
  return (
    <DashboardLayout>

      <div className="flex flex-col gap-2"> {/* Using gap-2 (8px) which is very tight but not zero */}
        
        {/* Welcome Header */}
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Welcome Back, John! 👋</h1>
           <p className="text-gray-500 text-sm">Here's what's happening with your mental health journey.</p>
        </div>

        {/* TOP ROW: Quick Actions (Left) + Next Appointment (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8">
            <PatientQuickActions />
          </div>
          <div className="xl:col-span-4 h-full">
            <PatientNextAppointmentCard />
          </div>
        </div>

        {/* BOTTOM ROW: APPOINTMENTS (Left) + RECENT ACTIVITY (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8">
            <PatientUpcomingAppointments />
          </div>
          <div className="xl:col-span-4">
             <PatientRecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
