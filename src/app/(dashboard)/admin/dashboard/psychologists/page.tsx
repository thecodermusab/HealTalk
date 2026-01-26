"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, Check, X, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PsychologistsManagementPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "all">("pending");

  const handleApprove = (id: number) => {
    console.log("Approve psychologist", id);
    alert(`Approved psychologist ${id} (placeholder).`);
  };

  const handleReject = (id: number) => {
    const confirmed = window.confirm("Reject this psychologist application?");
    if (!confirmed) {
      return;
    }
    console.log("Reject psychologist", id);
    alert(`Rejected psychologist ${id} (placeholder).`);
  };

  const handleSuspend = (id: number) => {
    const confirmed = window.confirm("Suspend this psychologist?");
    if (!confirmed) {
      return;
    }
    console.log("Suspend psychologist", id);
    alert(`Suspended psychologist ${id} (placeholder).`);
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
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Psychologist Management
          </h1>
          <p className="text-text-secondary">Review and approve psychologist applications</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <Input placeholder="Search psychologists..." className="pl-10" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "pending"
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-foreground"
            }`}
          >
            Pending ({pendingPsychologists.length})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "approved"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-foreground"
            }`}
          >
            Approved ({approvedPsychologists.length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "all"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-foreground"
            }`}
          >
            All ({pendingPsychologists.length + approvedPsychologists.length})
          </button>
        </div>

        {/* Pending Applications */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingPsychologists.map((psy) => (
              <div key={psy.id} className="bg-card border-2 border-accent/30 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {psy.name.split(" ")[1][0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{psy.name}</h3>
                      <p className="text-sm text-text-secondary mb-2">{psy.credentials}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {psy.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-text-secondary">
                        {psy.experience} years • {psy.hospital}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        Applied: {psy.submittedDate}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full">
                    Pending Review
                  </span>
                </div>

                {/* Documents */}
                <div className="mb-4 p-4 bg-background rounded-lg">
                  <div className="text-sm font-semibold text-foreground mb-2">Submitted Documents:</div>
                  <div className="flex flex-wrap gap-2">
                    {psy.documents.map((doc) => (
                      <button
                        key={doc}
                        className="px-3 py-1 bg-card border border-border rounded text-sm hover:border-primary transition-colors"
                      >
                        <Eye size={14} className="inline mr-1" />
                        {doc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    className="bg-success hover:bg-success/90 text-background"
                    onClick={() => handleApprove(psy.id)}
                  >
                    <Check size={16} className="mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                    onClick={() => handleReject(psy.id)}
                  >
                    <X size={16} className="mr-1" />
                    Reject
                  </Button>
                  <Button variant="outline">
                    View Full Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approved Psychologists */}
        {activeTab === "approved" && (
          <div className="space-y-4">
            {approvedPsychologists.map((psy) => (
              <div key={psy.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {psy.name.split(" ")[1][0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-foreground">{psy.name}</h3>
                        <span className="px-2 py-1 bg-success/10 text-success text-xs font-semibold rounded">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">{psy.credentials}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {psy.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-text-secondary">
                        {psy.experience} years • {psy.hospital}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-text-secondary">Appointments: </span>
                          <span className="font-semibold text-foreground">{psy.appointments}</span>
                        </div>
                        <div>
                          <span className="text-text-secondary">Rating: </span>
                          <span className="font-semibold text-foreground">{psy.rating} ★</span>
                        </div>
                        <div>
                          <span className="text-text-secondary">Approved: </span>
                          <span className="text-text-secondary">{psy.approvedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
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
