"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users } from "lucide-react";

export default function PsychologistPatientsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-500">Manage patient records and sessions</p>
        </div>

        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-[24px]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No patients yet</h3>
          <p className="text-gray-500">
            Patient profiles will appear here after your first bookings.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
