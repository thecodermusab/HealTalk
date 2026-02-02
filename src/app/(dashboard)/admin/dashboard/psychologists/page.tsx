"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users } from "lucide-react";

export default function PsychologistsManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Psychologist Management
          </h1>
          <p className="text-gray-500">
            Review and approve psychologist applications
          </p>
        </div>

        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-[24px]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No psychologists yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Psychologist applications will appear here once onboarding starts.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
