"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, Phone, Mail, Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
      <div className="max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Patients</h1>
            <p className="text-gray-500">Manage patient records and upcoming sessions</p>
          </div>
          <Link href="/psychologist/dashboard/messages">
            <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0] shadow-lg shadow-blue-500/20 rounded-[12px] h-11 px-6">
              <Mail className="mr-2" size={18} />
              Message Patients
            </Button>
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-between">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                placeholder="Search patients by name..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-12 h-12 rounded-[14px] bg-white border-[#E6EAF2] focus:border-[#5B6CFF] shadow-sm text-base"
                />
            </div>
            {/* Filter mock */}
            <Button variant="outline" className="hidden md:flex bg-white border-[#E6EAF2] rounded-[12px] h-12 px-5 text-gray-600 hover:bg-gray-50">
                Filter Status
            </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 hover:shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition-all group"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                
                <div className="flex items-start gap-5 w-full md:w-auto">
                  <div className="w-16 h-16 rounded-[16px] bg-[#EEF0FF] flex items-center justify-center flex-shrink-0 text-[#5B6CFF] text-2xl font-bold">
                    {patient.name.split(" ")[0][0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                      <span className={cn(
                          "px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide",
                          patient.status === "Active" ? "bg-[#E6F8F3] text-[#20C997]" : "bg-gray-100 text-gray-500"
                      )}>
                        {patient.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-6 mt-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">{patient.nextSession}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                         <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        Last: {patient.lastSession}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} className="text-gray-400" />
                        {patient.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} className="text-gray-400" />
                        {patient.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 justify-end">
                  <Link href={`/psychologist/dashboard/appointments`}>
                     <Button variant="outline" className="rounded-[12px] border-gray-200 text-gray-600 hover:bg-gray-50 h-10">
                        History
                     </Button>
                  </Link>
                  <Link href={`/psychologist/dashboard/messages?action=call`}>
                     <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0] text-white rounded-[12px] h-10 px-6 shadow-sm">
                        Details
                     </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-[24px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500">We couldn't find any patients matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
