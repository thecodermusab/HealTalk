"use client";

import { useEffect, useState } from "react";
import { Calendar, MessageSquare, CheckCircle, Clock, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: "APPOINTMENT" | "MESSAGE" | "COMPLETED";
  title: string;
  description: string;
  timestamp: Date;
  icon: "calendar" | "message" | "check" | "clock";
}

export function PatientRecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        // Fetch recent appointments
        const appointmentsRes = await fetch("/api/appointments");
        if (!appointmentsRes.ok) throw new Error("Failed to fetch appointments");

        const appointments = await appointmentsRes.json();

        // Convert appointments to activities
        const recentActivities: Activity[] = appointments
          .slice(0, 5)
          .map((apt: any) => {
            const psychologistName = apt.psychologist?.user?.name || "Psychologist";
            const status = apt.status;

            if (status === "COMPLETED") {
              return {
                id: apt.id,
                type: "COMPLETED",
                title: "Session Completed",
                description: `Completed session with ${psychologistName}`,
                timestamp: new Date(apt.endTime),
                icon: "check" as const,
              };
            } else if (status === "SCHEDULED") {
              return {
                id: apt.id,
                type: "APPOINTMENT",
                title: "Appointment Scheduled",
                description: `Upcoming session with ${psychologistName}`,
                timestamp: new Date(apt.createdAt || apt.startTime),
                icon: "calendar" as const,
              };
            } else {
              return {
                id: apt.id,
                type: "APPOINTMENT",
                title: "Appointment Updated",
                description: `${status} - ${psychologistName}`,
                timestamp: new Date(apt.updatedAt || apt.startTime),
                icon: "clock" as const,
              };
            }
          });

        setActivities(recentActivities);
      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, []);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "calendar": return <Calendar size={16} className="text-blue-500" />;
      case "message": return <MessageSquare size={16} className="text-green-500" />;
      case "check": return <CheckCircle size={16} className="text-emerald-500" />;
      case "clock": return <Clock size={16} className="text-orange-500" />;
      default: return <Calendar size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Recent Activity</h3>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-10">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      ) : activities.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-10 text-center text-sm text-gray-500">
          No recent activity yet.
        </div>
      ) : (
        <div className="space-y-4 flex-1 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
              <div className="flex-shrink-0 mt-1">
                {getIcon(activity.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
