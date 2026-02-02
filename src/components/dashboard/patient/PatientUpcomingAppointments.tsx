"use client";

import Link from "next/link";
import { useAppointments } from "@/hooks/useAppointments";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export function PatientUpcomingAppointments() {
  const { appointments, isLoading } = useAppointments();
  const now = new Date();
  const upcoming = appointments
    .filter((appointment) => appointment.status === "SCHEDULED")
    .filter((appointment) => new Date(appointment.startTime) >= now)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 text-lg">My Appointments</h3>
        <Link
          href="/patient/dashboard/appointments"
          className="text-sm text-[#5B6CFF] hover:underline font-medium"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-gray-500">
          Loading appointments...
        </div>
      ) : upcoming.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500">
          You don&apos;t have any upcoming appointments yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-4 font-medium text-gray-500 text-sm rounded-l-lg">
                  Psychologist
                </th>
                <th className="py-3 px-4 font-medium text-gray-500 text-sm">
                  Date
                </th>
                <th className="py-3 px-4 font-medium text-gray-500 text-sm">
                  Time
                </th>
                <th className="py-3 px-4 font-medium text-gray-500 text-sm rounded-r-lg">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {upcoming.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-gray-700">
                    {appointment.psychologist?.user?.name || "Psychologist"}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {formatDate(appointment.startTime)}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {appointment.type.replace("_", " ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
