"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Calendar, Clock, Video, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    },
  ];

  const appointments = activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Appointments</h1>
            <p className="text-text-secondary">Manage your upcoming and past sessions</p>
          </div>
          <Link href="/find-psychologists">
            <Button className="bg-primary hover:bg-primary/90">
              <Calendar className="mr-2" size={18} />
              Book New Appointment
            </Button>
          </Link>
        </div>

        {/* Tabs */}
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
            onClick={() => setActiveTab("past")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "past"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-foreground"
            }`}
          >
            Past ({pastAppointments.length})
          </button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">
                      {appointment.psychologist.split(" ")[1][0]}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {appointment.psychologist}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4">
                      {appointment.credentials}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Calendar size={16} className="text-primary" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Clock size={16} className="text-primary" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Video size={16} className="text-primary" />
                        {appointment.type}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <MapPin size={16} className="text-primary" />
                        {appointment.hospital}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {activeTab === "upcoming" ? (
                    <>
                      <Button className="bg-primary hover:bg-primary/90">
                        Join Session
                      </Button>
                      <Button variant="outline">Reschedule</Button>
                      <Button variant="ghost" className="text-red-500 hover:text-red-600">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline">
                        View Details
                      </Button>
                      <Button variant="outline">
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
          <div className="text-center py-16">
            <Calendar className="mx-auto mb-4 text-text-secondary" size={64} />
            <h3 className="text-xl font-bold text-foreground mb-2">
              No {activeTab} appointments
            </h3>
            <p className="text-text-secondary mb-6">
              {activeTab === "upcoming"
                ? "Book your first appointment to get started"
                : "Your completed appointments will appear here"}
            </p>
            {activeTab === "upcoming" && (
              <Link href="/find-psychologists">
                <Button className="bg-primary hover:bg-primary/90">
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
