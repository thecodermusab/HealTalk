"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Building } from "lucide-react";

export default function HospitalsManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Hospital Management
          </h1>
          <p className="text-gray-500">
            Manage partner hospitals and medical centers
          </p>
        </div>

        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-[24px]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hospitals yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Hospital records will appear here once onboarding starts.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
