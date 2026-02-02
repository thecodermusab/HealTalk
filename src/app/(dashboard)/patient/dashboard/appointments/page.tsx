"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Calendar, Clock, Video, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppointments } from "@/hooks/useAppointments";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const { appointments, isLoading } = useAppointments();
  const now = new Date();

  const upcomingAppointments = appointments
    .filter((appointment) => appointment.status === "SCHEDULED")
    .filter((appointment) => new Date(appointment.startTime) >= now)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  const pastAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status !== "SCHEDULED" ||
        new Date(appointment.startTime) < now
    )
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

  const list =
    activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              My Appointments
            </h1>
            <p className="text-gray-500">
              Manage your upcoming and past sessions
            </p>
          </div>
          <Link href="/find-psychologists">
            <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0] rounded-xl shadow-lg shadow-blue-500/20">
              <Calendar className="mr-2" size={18} />
              Book New Appointment
            </Button>
          </Link>
        </div>

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

        {isLoading ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-[24px]">
            <div className="text-gray-500">Loading appointments...</div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {list.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 hover:shadow-[0_8px_24px_rgba(17,24,39,0.02)] transition-shadow group"
                >
                  <div className="flex flex-col lg:flex-row items-start gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-[16px] bg-[#EEF0FF] flex items-center justify-center flex-shrink-0 border border-blue-100">
                        <span className="text-2xl font-bold text-[#5B6CFF]">
                          {(appointment.psychologist?.user?.name || "P")[0]}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {appointment.psychologist?.user?.name || "Psychologist"}
                          </h3>
                          {appointment.status === "SCHEDULED" && (
                            <span className="px-2 py-0.5 bg-[#E6F8F3] text-[#20C997] text-[10px] font-bold rounded-full uppercase tracking-wide flex items-center gap-1">
                              <CheckCircle size={10} /> Scheduled
                            </span>
                          )}
                          {appointment.status !== "SCHEDULED" && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-wide flex items-center gap-1">
                              <CheckCircle size={10} /> {appointment.status.toLowerCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#5B6CFF] font-medium mb-4">
                          {appointment.psychologist?.credentials || "Psychologist"}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                              <Calendar size={16} />
                            </div>
                            <span className="font-medium text-gray-900">
                              {formatDate(appointment.startTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                              <Clock size={16} />
                            </div>
                            <span className="font-medium text-gray-900">
                              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                              <Video size={16} />
                            </div>
                            <span>{appointment.type.replace("_", " ")}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-48 pt-4 lg:pt-0 lg:border-l lg:border-gray-100 lg:pl-6">
                      {activeTab === "upcoming" ? (
                        <>
                          <Button className="w-full bg-[#5B6CFF] hover:bg-[#4a5ae0]">
                            Join Session
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 justify-start lg:justify-center"
                          >
                            Cancel Appointment
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            className="w-full border-gray-200"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-[#5B6CFF] text-[#5B6CFF] hover:bg-[#EEF0FF]"
                          >
                            Book Again
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {list.length === 0 && (
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
