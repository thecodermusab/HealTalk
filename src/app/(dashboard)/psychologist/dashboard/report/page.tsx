"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FileText } from "lucide-react";

export default function ReportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Reports & Analytics
          </h1>
          <p className="text-text-secondary">
            Track your performance and practice growth
          </p>
        </div>

        <div className="bg-white border border-dashed border-gray-200 rounded-[24px] p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No reports yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Reports will be generated once sessions and analytics are available.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
