"use client";

import { Video, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PatientNextAppointmentCard() {
    return (
        <div className="bg-gradient-to-br from-[#5B6CFF] to-[#8090FF] rounded-[16px] p-5 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden h-full flex flex-col justify-between">
            {/* Decoration */}
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute bottom-[-10px] left-[-10px] w-16 h-16 bg-white/10 rounded-full" />
            
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm text-white/80 font-medium mb-1">Next Appointment</div>
                    <h3 className="text-2xl font-bold">Dr. Ahmet Yılmaz</h3>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Video size={20} className="text-white" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                   <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <Calendar size={14} />
                      <span>Tomorrow, Jan 27</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <Clock size={14} />
                      <span>2:00 PM - 3:00 PM</span>
                   </div>
                </div>
            </div>

            <div className="flex gap-3 relative z-10 mt-auto">
               <Button className="flex-1 bg-white text-[#5B6CFF] hover:bg-white/90 border-0 font-semibold shadow-sm" size="sm">
                  Join Session
               </Button>
               <Button className="flex-1 bg-transparent border-2 border-white/80 text-white hover:bg-white/10 hover:text-white font-semibold shadow-sm" size="sm">
                  Reschedule
               </Button>
            </div>
        </div>
    )
}
