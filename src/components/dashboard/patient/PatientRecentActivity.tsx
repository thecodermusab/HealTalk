"use client";

export function PatientRecentActivity() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Recent Activity</h3>
      </div>
      <div className="py-10 text-center text-sm text-gray-500">
        No recent activity yet.
      </div>
    </div>
  );
}
