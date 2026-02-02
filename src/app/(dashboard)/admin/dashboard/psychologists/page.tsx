"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  FileText,
  ShieldOff,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface PsychologistRow {
  id: string;
  credentials: string;
  licenseNumber: string;
  experience: number;
  specializations: string[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  hasCredentialDocument: boolean;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  hospital: {
    name: string;
    location: string;
  } | null;
}

const statusTabs = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "All", value: "ALL" },
];

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  SUSPENDED: "bg-gray-100 text-gray-700",
};

const formatDate = (value: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

export default function PsychologistsManagementPage() {
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<PsychologistRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const limit = 10;

  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  const loadPsychologists = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);

    const params = new URLSearchParams({
      status: statusFilter,
      search: search.trim(),
      page: String(page),
      limit: String(limit),
    });

    try {
      const res = await fetch(`/api/admin/psychologists?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to load psychologists.");
      }
      const data = await res.json();
      setRows(data.psychologists || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to load psychologists.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPsychologists();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadPsychologists]);

  const handleStatusUpdate = async (id: string, status: PsychologistRow["status"]) => {
    const confirmText = `Change status to ${status}?`;
    if (!window.confirm(confirmText)) return;

    let rejectionReason = "";
    if (status === "REJECTED") {
      rejectionReason = window.prompt("Rejection reason (optional):") || "";
    }

    setIsUpdatingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/psychologists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to update status.");
      }

      await loadPsychologists();
      setMessage({ type: "success", text: "Status updated successfully." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update status.",
      });
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleViewCredential = async (id: string) => {
    setMessage(null);
    try {
      const res = await fetch(`/api/uploads/credential?psychologistId=${id}`);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to fetch credential document.");
      }
      const data = await res.json();
      if (data?.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to fetch credential document.",
      });
    }
  };

  const statusSummary = useMemo(() => {
    if (total === 0) return "No records";
    return `${total} psychologist${total === 1 ? "" : "s"}`;
  }, [total]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Psychologist Management
          </h1>
          <p className="text-gray-500">
            Review credentials, approve applicants, and manage status updates.
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
              placeholder="Search by name, email, or license"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              className="w-full lg:w-[320px]"
            />
            <span className="text-sm text-gray-500">{statusSummary}</span>
          </div>
        </div>

        {message && (
          <div
            className={cn(
              "w-full rounded-xl border px-4 py-3 text-sm",
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-100"
                : "bg-red-50 text-red-700 border-red-100"
            )}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-[24px] py-20 text-center text-gray-500">
              Loading psychologists...
            </div>
          ) : rows.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-[24px] py-20 text-center text-gray-500">
              No psychologists found for this filter.
            </div>
          ) : (
            rows.map((row) => (
              <div
                key={row.id}
                className="bg-white border border-[#E6EAF2] rounded-[20px] p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="space-y-3">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {row.user?.name || "Unnamed Psychologist"}
                      </div>
                      <div className="text-sm text-gray-500">{row.user?.email}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        License: {row.licenseNumber}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        Experience: {row.experience} yrs
                      </span>
                      {row.hospital && (
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                          {row.hospital.name}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 max-w-2xl">
                      {row.credentials}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {row.specializations.slice(0, 4).map((spec) => (
                        <span
                          key={spec}
                          className="px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[#5B6CFF] text-xs font-semibold"
                        >
                          {spec}
                        </span>
                      ))}
                      {row.specializations.length > 4 && (
                        <span className="text-xs text-gray-400">
                          +{row.specializations.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 w-full lg:w-[240px]">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold",
                          statusStyles[row.status]
                        )}
                      >
                        {row.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        Joined {formatDate(row.createdAt)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      Approved: {formatDate(row.approvedAt)}
                      <br />
                      Rejected: {formatDate(row.rejectedAt)}
                      {row.rejectionReason && (
                        <div className="mt-2 text-[11px] text-red-500">
                          Reason: {row.rejectionReason}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {row.hasCredentialDocument ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => handleViewCredential(row.id)}
                        >
                          <FileText size={14} /> View Document
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">No credential file</span>
                      )}

                      {row.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 gap-2"
                            disabled={isUpdatingId === row.id}
                            onClick={() => handleStatusUpdate(row.id, "APPROVED")}
                          >
                            <CheckCircle size={14} /> Approve
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 gap-2"
                            disabled={isUpdatingId === row.id}
                            onClick={() => handleStatusUpdate(row.id, "REJECTED")}
                          >
                            <XCircle size={14} /> Reject
                          </Button>
                        </>
                      )}

                      {row.status === "APPROVED" && (
                        <Button
                          size="sm"
                          className="bg-gray-700 hover:bg-gray-800 gap-2"
                          disabled={isUpdatingId === row.id}
                          onClick={() => handleStatusUpdate(row.id, "SUSPENDED")}
                        >
                          <ShieldOff size={14} /> Suspend
                        </Button>
                      )}

                      {row.status === "SUSPENDED" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 gap-2"
                            disabled={isUpdatingId === row.id}
                            onClick={() => handleStatusUpdate(row.id, "APPROVED")}
                          >
                            <RefreshCw size={14} /> Reinstate
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 gap-2"
                            disabled={isUpdatingId === row.id}
                            onClick={() => handleStatusUpdate(row.id, "REJECTED")}
                          >
                            <XCircle size={14} /> Reject
                          </Button>
                        </>
                      )}

                      {row.status === "REJECTED" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 gap-2"
                          disabled={isUpdatingId === row.id}
                          onClick={() => handleStatusUpdate(row.id, "APPROVED")}
                        >
                          <CheckCircle size={14} /> Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!canGoBack}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!canGoForward}
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
