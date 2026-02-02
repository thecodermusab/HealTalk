"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Building } from "lucide-react";

interface HospitalRow {
  id: string;
  name: string;
  location: string;
  address: string;
  status: string;
  createdAt: string;
  psychologistCount: number;
}

const statusTabs = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));

export default function HospitalsManagementPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hospitals, setHospitals] = useState<HospitalRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const limit = 10;

  const loadHospitals = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);

    const params = new URLSearchParams({
      status: statusFilter,
      search: search.trim(),
      page: String(page),
      limit: String(limit),
    });

    try {
      const res = await fetch(`/api/admin/hospitals?${params.toString()}`);
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || "Failed to load hospitals.");
      }
      const payload = await res.json();
      setHospitals(payload.hospitals || []);
      setTotalPages(payload.pagination?.totalPages || 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load hospitals.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => loadHospitals(), 250);
    return () => clearTimeout(timer);
  }, [loadHospitals]);

  const summary = useMemo(() => {
    if (hospitals.length === 0) return "No hospitals";
    return `${hospitals.length} hospital${hospitals.length === 1 ? "" : "s"}`;
  }, [hospitals.length]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Hospital Management
          </h1>
          <p className="text-gray-500">
            Manage partner hospitals and medical centers
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setPage(1);
                  setStatusFilter(tab.value);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold border transition-colors",
                  statusFilter === tab.value
                    ? "bg-[#5B6CFF] text-white border-[#5B6CFF]"
                    : "bg-white text-gray-600 border-[#E6EAF2] hover:border-[#5B6CFF]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search hospitals"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              className="w-full lg:w-[320px]"
            />
            <span className="text-sm text-gray-500">{summary}</span>
          </div>
        </div>

        {message && (
          <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-[24px] py-20 text-center text-gray-500">
            Loading hospitals...
          </div>
        ) : hospitals.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-[24px] py-20 text-center text-gray-500">
            No hospitals found.
          </div>
        ) : (
          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white border border-[#E6EAF2] rounded-[20px] p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building size={18} className="text-[#5B6CFF]" />
                      <div className="text-lg font-semibold text-gray-900">
                        {hospital.name}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{hospital.location}</div>
                    <div className="text-xs text-gray-400 max-w-2xl">{hospital.address}</div>
                    <div className="text-xs text-gray-400">
                      Added {formatDate(hospital.createdAt)} · {hospital.psychologistCount} psychologists
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        statusStyles[hospital.status] || "bg-gray-100 text-gray-700"
                      )}
                    >
                      {hospital.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
