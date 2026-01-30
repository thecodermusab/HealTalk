"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, Check, X, Eye, Shield, Award, Calendar, Clock, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PsychologistsManagementPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "all">("pending");

  const handleApprove = (id: number) => {
    console.log("Approve psychologist", id);
  };

  const handleReject = (id: number) => {
    const confirmed = window.confirm("Reject this psychologist application?");
    if (!confirmed) {
      return;
    }
    console.log("Reject psychologist", id);
  };

  const handleSuspend = (id: number) => {
    const confirmed = window.confirm("Suspend this psychologist?");
    if (!confirmed) {
      return;
    }
    console.log("Suspend psychologist", id);
  };

  const pendingPsychologists = [
    {
      id: 1,
      name: "Dr. Zeynep Arslan",
      credentials: "PhD, Clinical Psychologist",
      experience: 8,
      specializations: ["Depression", "Anxiety Disorders"],
      hospital: "Acıbadem Hospital, Ankara",
      submittedDate: "Jan 24, 2026",
      documents: ["License", "PhD Certificate", "References"],
    },
    {
      id: 2,
      name: "Dr. Can Öztürk",
      credentials: "PhD, Family Therapist",
      experience: 6,
      specializations: ["Family Therapy", "Couples Counseling"],
      hospital: "Memorial Hospital, Izmir",
      submittedDate: "Jan 23, 2026",
      documents: ["License", "PhD Certificate"],
    },
  ];

  const approvedPsychologists = [
    {
      id: 3,
      name: "Dr. Ahmet Yılmaz",
      credentials: "PhD, Clinical Psychologist",
      experience: 12,
      specializations: ["Anxiety Disorders", "Depression", "Trauma & PTSD"],
      hospital: "Acıbadem Hospital, Istanbul",
      approvedDate: "Jan 15, 2026",
      status: "active",
      appointments: 145,
      rating: 4.8,
    },
    {
      id: 4,
      name: "Dr. Ayşe Demir",
      credentials: "PhD, Clinical Psychologist",
      experience: 10,
      specializations: ["Trauma & PTSD", "Family Therapy"],
      hospital: "Memorial Hospital, Istanbul",
      approvedDate: "Jan 10, 2026",
      status: "active",
      appointments: 128,
      rating: 4.9,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Psychologist Management
          </h1>
          <p className="text-gray-500">Review and approve psychologist applications</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
                placeholder="Search psychologists..." 
                className="pl-10 h-11 rounded-[12px] border-[#E6EAF2] focus-visible:ring-[#5B6CFF] focus-visible:border-[#5B6CFF]" 
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100/50 rounded-xl w-fit border border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={cn(
                "px-6 py-2.5 text-sm font-semibold rounded-lg transition-all",
                activeTab === "pending"
                  ? "bg-white text-[#FF9F43] shadow-sm border border-gray-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
             )}
          >
            Pending ({pendingPsychologists.length})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={cn(
                "px-6 py-2.5 text-sm font-semibold rounded-lg transition-all",
                activeTab === "approved"
                  ? "bg-white text-[#5B6CFF] shadow-sm border border-gray-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
             )}
          >
            Approved ({approvedPsychologists.length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
                "px-6 py-2.5 text-sm font-semibold rounded-lg transition-all",
                activeTab === "all"
                  ? "bg-white text-[#5B6CFF] shadow-sm border border-gray-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
             )}
          >
            All ({pendingPsychologists.length + approvedPsychologists.length})
          </button>
        </div>

        {/* Pending Applications */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingPsychologists.map((psy) => (
              <div key={psy.id} className="bg-white border border-[#FFF5EB] rounded-[16px] p-6 shadow-[0_8px_24px_rgba(255,159,67,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF9F43]" />
                
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 rounded-[16px] bg-[#FFF5EB] flex items-center justify-center border border-orange-100 text-[#FF9F43] font-bold text-2xl flex-shrink-0">
                        {psy.name.split(" ")[1][0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                         <h3 className="text-xl font-bold text-gray-900">{psy.name}</h3>
                         <span className="px-2.5 py-0.5 bg-[#FFF5EB] text-[#FF9F43] text-[10px] font-bold uppercase tracking-wide rounded-full flex items-center gap-1">
                            <Clock size={10} /> Pending Review
                         </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 font-medium mb-3">{psy.credentials}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {psy.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-md"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                         <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                            <Award size={14} className="text-gray-400" />
                            {psy.experience} years exp.
                         </div>
                         <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                            <Building size={14} className="text-gray-400" />
                            {psy.hospital}
                         </div>
                         <div className="flex items-center gap-1.5 px-2 py-1">
                            <Calendar size={14} className="text-gray-400" />
                            Applied: {psy.submittedDate}
                         </div>
                      </div>
                    </div>
                  </div>
                
                 {/* Right Column: Actions & Docs */}
                 <div className="w-full lg:w-80 flex flex-col gap-4">
                     {/* Documents */}
                    <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Submitted Documents</div>
                        <div className="flex flex-wrap gap-2">
                            {psy.documents.map((doc) => (
                            <button
                                key={doc}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:border-[#5B6CFF] hover:text-[#5B6CFF] transition-all flex items-center gap-1 shadow-sm"
                            >
                                <Eye size={12} />
                                {doc}
                            </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            className="flex-1 bg-[#20C997] hover:bg-[#1BA87E] text-white shadow-lg shadow-green-500/20 rounded-xl"
                            onClick={() => handleApprove(psy.id)}
                        >
                            <Check size={16} className="mr-1.5" />
                            Approve
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-500 rounded-xl"
                            onClick={() => handleReject(psy.id)}
                        >
                            <X size={16} className="mr-1.5" />
                            Reject
                        </Button>
                    </div>
                 </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approved Psychologists */}
        {activeTab === "approved" && (
          <div className="space-y-4">
            {approvedPsychologists.map((psy) => (
              <div key={psy.id} className="bg-white border border-[#E6EAF2] rounded-[16px] p-6 hover:shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition-all group">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 rounded-[16px] bg-[#EEF0FF] flex items-center justify-center border border-blue-50 text-[#5B6CFF] font-bold text-2xl flex-shrink-0">
                        {psy.name.split(" ")[1][0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{psy.name}</h3>
                        <span className="px-2.5 py-0.5 bg-[#E6F8F3] text-[#20C997] text-[10px] font-bold uppercase tracking-wide rounded-full flex items-center gap-1">
                           <Shield size={10} /> Active
                        </span>
                      </div>
                      <p className="text-sm text-[#5B6CFF] font-medium mb-2">{psy.credentials}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {psy.specializations.slice(0, 3).map((spec) => (
                          <span
                            key={spec}
                             className="px-2 py-1 bg-[#F4F7FF] text-[#5B6CFF] text-[10px] font-bold rounded-md"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 mt-3 text-sm border-t border-gray-100 pt-3">
                        <div>
                          <span className="text-gray-500">Appointments: </span>
                          <span className="font-bold text-gray-900">{psy.appointments}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Rating: </span>
                          <span className="font-bold text-gray-900">{psy.rating} ★</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Since: </span>
                          <span className="font-medium text-gray-900">{psy.approvedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 self-start md:self-center">
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                      View Profile
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleSuspend(psy.id)}
                    >
                      Suspend
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
