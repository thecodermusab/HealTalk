"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, Phone, Mail, Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PsychologistPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const patients = [
    {
      id: 1,
      name: "John Doe",
      status: "Active",
      lastSession: "Today",
      nextSession: "Tomorrow, 2:00 PM",
      email: "john@example.com",
      phone: "+90 555 123 4567",
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      status: "Active",
      lastSession: "Yesterday",
      nextSession: "Friday, 11:00 AM",
      email: "sarah@example.com",
      phone: "+90 555 234 5678",
    },
    {
      id: 3,
      name: "Michael Kim",
      status: "Paused",
      lastSession: "Jan 18, 2026",
      nextSession: "Not scheduled",
      email: "michael@example.com",
      phone: "+90 555 345 6789",
    },
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPatients = normalizedQuery
    ? patients.filter((patient) =>
        patient.name.toLowerCase().includes(normalizedQuery)
      )
    : patients;

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Patients</h1>
            <p className="text-text-secondary">Review patient details and follow-up needs</p>
          </div>
          <Link href="/psychologist/dashboard/messages">
            <Button className="bg-primary hover:bg-primary/90">
              Message Patients
            </Button>
          </Link>
        </div>

        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="text-primary" size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{patient.name}</h3>
                      <span className="px-2 py-1 bg-success/10 text-success text-xs font-semibold rounded">
                        {patient.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        Last session: {patient.lastSession}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        Next session: {patient.nextSession}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-primary" />
                        {patient.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-primary" />
                        {patient.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline">View Profile</Button>
                  <Link href="/psychologist/dashboard/appointments">
                    <Button variant="outline">View Appointments</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-16">
            <User className="mx-auto mb-4 text-text-secondary" size={64} />
            <h3 className="text-xl font-bold text-foreground mb-2">No patients found</h3>
            <p className="text-text-secondary">Try adjusting your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
