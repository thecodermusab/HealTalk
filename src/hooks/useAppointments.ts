import { useEffect, useState } from "react";

type AppointmentType = "VIDEO" | "AUDIO" | "IN_PERSON";
type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export type AppointmentRecord = {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  duration: number;
  type: AppointmentType;
  status: AppointmentStatus;
  createdAt?: string;
  psychologist?: {
    id: string;
    user?: { name: string | null; image: string | null };
  } | null;
  patient?: {
    id: string;
    user?: { name: string | null; image: string | null };
  } | null;
};

export function useAppointments(status?: AppointmentStatus) {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const query = status ? `?status=${status}` : "";
        const res = await fetch(`/api/appointments${query}`);
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          if (isMounted) {
            setError(data?.error || "Failed to load appointments.");
            setAppointments([]);
          }
          return;
        }

        const data = (await res.json()) as AppointmentRecord[];
        if (isMounted) {
          setAppointments(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load appointments.");
          setAppointments([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [status]);

  return { appointments, isLoading, error };
}
