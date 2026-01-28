"use client";

import { MessageCircle, Calendar, Heart } from "lucide-react";

export function PatientRecentActivity() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Recent Activity</h3>
      </div>
      
      <div className="space-y-6">
        {/* Activity Item 1 */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#EEF0FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <MessageCircle className="text-[#5B6CFF]" size={16} />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">New message</div>
            <p className="text-xs text-gray-500 mb-1">From Dr. Ahmet Yılmaz</p>
            <span className="text-[10px] text-gray-400">2 hours ago</span>
          </div>
        </div>

        {/* Activity Item 2 */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#E6F8F3] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
             <Calendar className="text-[#20C997]" size={16} />
          </div>
          <div>
             <div className="text-sm font-semibold text-gray-900">Appointment Confirmed</div>
             <p className="text-xs text-gray-500 mb-1">Video session scheduled</p>
             <span className="text-[10px] text-gray-400">Yesterday</span>
          </div>
        </div>

        {/* Activity Item 3 */}
        <div className="flex items-start gap-3">
           <div className="w-8 h-8 bg-[#FFF5EB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Heart className="text-[#FF9F43]" size={16} />
           </div>
           <div>
              <div className="text-sm font-semibold text-gray-900">New Favorite</div>
              <p className="text-xs text-gray-500 mb-1">Added Dr. Ayşe to favorites</p>
              <span className="text-[10px] text-gray-400">2 days ago</span>
           </div>
        </div>
      </div>
    </div>
  );
}
