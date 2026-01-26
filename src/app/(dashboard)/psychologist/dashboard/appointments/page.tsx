"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PsychologistAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

  const upcomingAppointments = [
    {
      id: 1,
      patient: "John D.",
      date: "Today, Jan 27, 2026",
      time: "2:00 PM - 3:00 PM",
      type: "Video Consultation",
      location: "Online",
      status: "confirmed",
    },
    {
      id: 2,
      patient: "Sarah M.",
      date: "Tomorrow, Jan 28, 2026",
      time: "10:00 AM - 11:00 AM",
      type: "Video Consultation",
      location: "Online",
      status: "confirmed",
    },
  ];

  const completedAppointments = [
    {
      id: 3,
      patient: "Michael K.",
      date: "Jan 20, 2026",
      time: "4:00 PM - 5:00 PM",
      type: "Video Consultation",
      location: "Online",
      status: "completed",
    },
  ];

  const appointments = activeTab === "upcoming" ? upcomingAppointments : completedAppointments;

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Appointments</h1>
            <p className="text-text-secondary">Manage your schedule and session history</p>
          </div>
          <Link href="/psychologist/dashboard/profile">
            <Button className="bg-primary hover:bg-primary/90">
              <Calendar className="mr-2" size={18} />
              Update Availability
            </Button>
          </Link>
        </div>

        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "upcoming"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-foreground"
            }`}
          >
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "completed"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-foreground"
            }`}
          >
            Completed ({completedAppointments.length})
          </button>
        </div>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">
                      {appointment.patient[0]}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {appointment.patient}
                      </h3>
                      <span className="px-2 py-1 bg-success/10 text-success text-xs font-semibold rounded">
                        {appointment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Video size={16} className="text-primary" />
                        {appointment.type}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        {appointment.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {activeTab === "upcoming" ? (
                    <>
                      <Button className="bg-primary hover:bg-primary/90">
                        Start Session
                      </Button>
                      <Button variant="outline">Reschedule</Button>
                      <Link href="/psychologist/dashboard/messages">
                        <Button variant="ghost">Message Patient</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button variant="outline">View Notes</Button>
                      <Link href="/psychologist/dashboard/messages">
                        <Button variant="outline">Follow Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="mx-auto mb-4 text-text-secondary" size={64} />
            <h3 className="text-xl font-bold text-foreground mb-2">
              No {activeTab} appointments
            </h3>
            <p className="text-text-secondary">
              {activeTab === "upcoming"
                ? "Your upcoming sessions will appear here."
                : "Completed sessions will appear here once finished."}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
