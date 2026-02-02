"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, User, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface RecentBooking {
  id: string;
  patientName: string;
  patientImage: string | null;
  startTime: Date;
  duration: number;
  createdAt: Date;
}

export function AppointmentRequests() {
  const [bookings, setBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentBookings() {
      try {
        const res = await fetch("/api/appointments?status=SCHEDULED");
        if (!res.ok) throw new Error("Failed to fetch appointments");

        const appointments = await res.json();

        // Get recent bookings (within last 7 days)
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const recent = appointments
          .filter((apt: any) => {
            const created = new Date(apt.createdAt || apt.startTime);
            return created >= sevenDaysAgo;
          })
          .sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || a.startTime);
            const dateB = new Date(b.createdAt || b.startTime);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 5)
          .map((apt: any) => ({
            id: apt.id,
            patientName: apt.patient?.user?.name || "Patient",
            patientImage: apt.patient?.user?.image,
            startTime: new Date(apt.startTime),
            duration: apt.duration,
            createdAt: new Date(apt.createdAt || apt.startTime),
          }));

        setBookings(recent);
      } catch (err) {
        console.error("Error fetching recent bookings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentBookings();
  }, []);

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Recent Bookings</h3>
        <Link href="/psychologist/dashboard/appointments" className="text-sm text-[#5B6CFF] hover:underline font-medium">
          See All
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          No recent bookings in the last 7 days.
        </div>
      ) : (
        <div className="space-y-4 flex-1 overflow-y-auto">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {booking.patientImage ? (
                  <img
                    src={booking.patientImage}
                    alt={booking.patientName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {booking.patientName}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Calendar size={12} />
                  <span>{booking.startTime.toLocaleDateString()}</span>
                  <Clock size={12} className="ml-1" />
                  <span>{booking.duration} min</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Booked {formatDistanceToNow(booking.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
