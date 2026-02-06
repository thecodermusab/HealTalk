"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { SessionCard } from "@/components/sessions/SessionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PatientSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningSessionId, setJoiningSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("DATE");

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      const params = new URLSearchParams();
      params.append("status", "SCHEDULED");

      const today = new Date();
      params.append("fromDate", today.toISOString());

      const res = await fetch(`/api/sessions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinSession(sessionId: string) {
    console.log("🎯 Joining session:", sessionId);
    setJoiningSessionId(sessionId);

    try {
      const res = await fetch(`/api/sessions/${sessionId}/join`, {
        method: "POST",
      });

      console.log("Response status:", res.status);

      if (res.ok) {
        console.log("✅ Successfully joined!");
        alert("Successfully registered for session! 🎉");
        await fetchSessions();
      } else {
        const error = await res.json();
        console.error("❌ Error:", error);
        alert(error.error || "Failed to join session");
      }
    } catch (err) {
      console.error("❌ Error joining session:", err);
      alert("Failed to join session. Please try again.");
    } finally {
      setJoiningSessionId(null);
    }
  }

  // Filter and sort sessions
  let filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.psychologist.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "ALL" || session.type === typeFilter;

    return matchesSearch && matchesType;
  });

  if (sortBy === "DATE") {
    filteredSessions.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  } else if (sortBy === "PRICE") {
    filteredSessions.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
  } else if (sortBy === "SPOTS") {
    filteredSessions.sort((a, b) => (b.availableSpots || 0) - (a.availableSpots || 0));
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Discover Sessions</h1>
          <p className="text-gray-500">Find and join group therapy sessions</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-[24px] p-6">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search sessions, topics, or psychologists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Session Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="GROUP">Group Only</SelectItem>
                <SelectItem value="ONE_ON_ONE">One-on-One</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DATE">Date (Soonest)</SelectItem>
                <SelectItem value="PRICE">Price (Low to High)</SelectItem>
                <SelectItem value="SPOTS">Available Spots</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sessions Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-[24px]">
            <p className="text-gray-500 mb-2">
              {searchQuery || typeFilter !== "ALL"
                ? "No sessions match your filters"
                : "No upcoming sessions available"}
            </p>
            <p className="text-sm text-gray-400">Check back later for new sessions</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredSessions.length} session{filteredSessions.length !== 1 ? "s" : ""}{" "}
                available
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onJoin={handleJoinSession}
                  showJoinButton={true}
                  isLoading={joiningSessionId === session.id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
