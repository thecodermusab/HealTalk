"use client";

export function AppointmentRequests() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] h-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
         <h3 className="font-bold text-gray-900 text-lg">Appointment Requests</h3>
         <a href="#" className="text-sm text-[#5B6CFF] hover:underline font-medium">See All</a>
       </div>

       <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
         No appointment requests yet.
       </div>
    </div>
  );
}
