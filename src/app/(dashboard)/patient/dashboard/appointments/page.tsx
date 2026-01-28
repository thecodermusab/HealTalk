"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Calendar, Clock, Video, MapPin, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingAppointments = [
    {
      id: 1,
      psychologist: "Dr. Ahmet Yılmaz",
      credentials: "PhD, Clinical Psychologist",
      date: "Tomorrow, Jan 27, 2026",
      time: "2:00 PM - 3:00 PM",
      type: "Video Consultation",
      hospital: "Acıbadem Hospital, Istanbul",
      status: "confirmed",
      image: "/images/doctor1.png"
    },
    {
      id: 2,
      psychologist: "Dr. Ayşe Demir",
      credentials: "PhD, Clinical Psychologist",
      date: "Jan 30, 2026",
      time: "4:00 PM - 5:00 PM",
      type: "Video Consultation",
      hospital: "Memorial Hospital, Istanbul",
      status: "confirmed",
      image: "/images/doctor2.png"
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      psychologist: "Dr. Ahmet Yılmaz",
      credentials: "PhD, Clinical Psychologist",
      date: "Jan 20, 2026",
      time: "2:00 PM - 3:00 PM",
      type: "Video Consultation",
      hospital: "Acıbadem Hospital, Istanbul",
      status: "completed",
      image: "/images/doctor1.png"
    },
  ];

  const appointments = activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Appointments</h1>
            <p className="text-gray-500">Manage your upcoming and past sessions</p>
          </div>
          <Link href="/find-psychologists">
            <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0] rounded-xl shadow-lg shadow-blue-500/20">
              <Calendar className="mr-2" size={18} />
              Book New Appointment
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100/50 rounded-xl w-fit border border-gray-200">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={cn(
               "px-6 py-2.5 text-sm font-semibold rounded-lg transition-all",
               activeTab === "upcoming"
                 ? "bg-white text-[#5B6CFF] shadow-sm border border-gray-100"
                 : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
          >
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={cn(
                "px-6 py-2.5 text-sm font-semibold rounded-lg transition-all",
                activeTab === "past"
                  ? "bg-white text-[#5B6CFF] shadow-sm border border-gray-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
             )}
          >
            Past ({pastAppointments.length})
          </button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 hover:shadow-[0_8px_24px_rgba(17,24,39,0.02)] transition-shadow group"
            >
              <div className="flex flex-col lg:flex-row items-start gap-6">
                
                {/* Avatar & Basic Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-[16px] bg-[#EEF0FF] flex items-center justify-center flex-shrink-0 border border-blue-100">
                    <span className="text-2xl font-bold text-[#5B6CFF]">
                      {appointment.psychologist.split(" ")[1][0]}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">
                        {appointment.psychologist}
                        </h3>
                        {appointment.status === "confirmed" && (
                            <span className="px-2 py-0.5 bg-[#E6F8F3] text-[#20C997] text-[10px] font-bold rounded-full uppercase tracking-wide flex items-center gap-1">
                                <CheckCircle size={10} /> Confirmed
                            </span>
                        )}
                        {appointment.status === "completed" && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-wide flex items-center gap-1">
                                <CheckCircle size={10} /> Completed
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-[#5B6CFF] font-medium mb-4">
                      {appointment.credentials}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                            <Calendar size={16} />
                        </div>
                        <span className="font-medium text-gray-900">{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                            <Clock size={16} />
                         </div>
                         <span className="font-medium text-gray-900">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                            <Video size={16} />
                         </div>
                        <span>{appointment.type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-48 pt-4 lg:pt-0 lg:border-l lg:border-gray-100 lg:pl-6">
                  {activeTab === "upcoming" ? (
                    <>
                      <Button className="w-full bg-[#5B6CFF] hover:bg-[#4a5ae0]">
                        Join Session
                      </Button>
                      <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50">Reschedule</Button>
                      <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 justify-start lg:justify-center">
                        Cancel Appointment
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full border-gray-200">
                        View Details
                      </Button>
                      <Button variant="outline" className="w-full border-[#5B6CFF] text-[#5B6CFF] hover:bg-[#EEF0FF]">
                        Book Again
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-[24px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No {activeTab} appointments
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              {activeTab === "upcoming"
                ? "You don't have any upcoming sessions scheduled. Book a new appointment to get started."
                : "Your completed appointment history will appear here once you finish your sessions."}
            </p>
            {activeTab === "upcoming" && (
              <Link href="/find-psychologists">
                <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0] h-11 px-8 rounded-xl">
                  Find a Psychologist
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
