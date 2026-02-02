"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { TrendingUp } from "lucide-react";

export default function ProgressPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Progress</h1>
          <p className="text-text-secondary">Track your mental health journey</p>
        </div>

        <div className="bg-white border border-dashed border-gray-200 rounded-[24px] p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No progress data yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Progress tracking will appear once you start logging sessions and mood
            entries.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
