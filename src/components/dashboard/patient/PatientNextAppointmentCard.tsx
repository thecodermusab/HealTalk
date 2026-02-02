"use client";

import Link from "next/link";
import { Calendar, Clock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppointments } from "@/hooks/useAppointments";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export function PatientNextAppointmentCard() {
    const { appointments, isLoading } = useAppointments();
    const now = new Date();
    const upcoming = appointments
      .filter((appointment) => appointment.status === "SCHEDULED")
      .filter((appointment) => new Date(appointment.startTime) >= now)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    const nextAppointment = upcoming[0];

    return (
        <div className="bg-gradient-to-br from-[#5B6CFF] to-[#8090FF] rounded-[16px] p-5 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden h-full flex flex-col justify-between">
            {/* Decoration */}
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute bottom-[-10px] left-[-10px] w-16 h-16 bg-white/10 rounded-full" />
            
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm text-white/80 font-medium mb-1">Next Appointment</div>
                    <h3 className="text-2xl font-bold">
                      {isLoading
                        ? "Loading..."
                        : nextAppointment?.psychologist?.user?.name || "No upcoming appointments"}
                    </h3>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Video size={20} className="text-white" />
                  </div>
                </div>

                {nextAppointment ? (
                  <div className="flex flex-wrap gap-4 mb-4">
                     <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        <Calendar size={14} />
                        <span>{formatDate(nextAppointment.startTime)}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        <Clock size={14} />
                        <span>
                          {formatTime(nextAppointment.startTime)} - {formatTime(nextAppointment.endTime)}
                        </span>
                     </div>
                  </div>
                ) : (
                  <p className="text-sm text-white/80 mb-4">
                    {isLoading ? "Checking schedule..." : "Book your first session to get started."}
                  </p>
                )}
            </div>

            <div className="flex gap-3 relative z-10 mt-auto">
               {nextAppointment ? (
                 <>
                   <Link href={`/shared/call/${nextAppointment.id}`} className="flex-1">
                     <Button className="w-full bg-white text-[#5B6CFF] hover:bg-white/90 border-0 font-semibold shadow-sm" size="sm">
                        Join Session
                     </Button>
                   </Link>
                   <Button className="flex-1 bg-transparent border-2 border-white/80 text-white hover:bg-white/10 hover:text-white font-semibold shadow-sm" size="sm">
                      Reschedule
                   </Button>
                 </>
               ) : (
                 <Link href="/find-psychologists" className="flex-1">
                   <Button className="w-full bg-white text-[#5B6CFF] hover:bg-white/90 border-0 font-semibold shadow-sm" size="sm">
                      Find a Psychologist
                   </Button>
                 </Link>
               )}
            </div>
        </div>
    )
}
