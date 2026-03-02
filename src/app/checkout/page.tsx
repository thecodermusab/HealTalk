"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  CreditCard,
  Lock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { fetchCsrfToken } from "@/lib/client-security";

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

type PsychologistPreview = {
  name: string;
  image: string | null;
  credentials: string;
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const psychologistId = searchParams?.get("psychologistId") || "";
  const doctorName = searchParams?.get("doctor") || "Dr. Therapist";
  const doctorImageParam = searchParams?.get("doctorImage") || "";
  const startParam = searchParams?.get("start");
  const endParam = searchParams?.get("end");
  const timeParam = searchParams?.get("time") || "10:00 AM";
  const price = searchParams?.get("price") || "$150";

  const start = startParam ? new Date(startParam) : null;
  const end = endParam ? new Date(endParam) : null;
  const hasValidDates = Boolean(
    start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
  );
  const durationMinutes = hasValidDates
    ? Math.max(1, Math.round((end!.getTime() - start!.getTime()) / 60000))
    : 60;
  const dateLabel = hasValidDates
    ? start!.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Today";
  const timeLabel = hasValidDates
    ? `${start!.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })} - ${end!.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`
    : timeParam;

  const [doctorPreview, setDoctorPreview] = useState<PsychologistPreview>({
    name: doctorName,
    image: doctorImageParam || null,
    credentials: "Psychology Consultation",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!psychologistId) return;
    let cancelled = false;

    const loadPreview = async () => {
      try {
        const response = await fetch(`/api/psychologists/${psychologistId}`);
        if (!response.ok) return;
        const payload = (await response.json()) as {
          user?: { name?: string; image?: string | null };
          credentials?: string;
        };
        if (cancelled) return;
        setDoctorPreview({
          name: payload.user?.name || doctorName,
          image: payload.user?.image || doctorImageParam || null,
          credentials: payload.credentials || "Psychology Consultation",
        });
      } catch {
        // Ignore preview failures; fallback UI already shown.
      }
    };

    loadPreview();
    return () => {
      cancelled = true;
    };
  }, [doctorImageParam, doctorName, psychologistId]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 2200);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!psychologistId || !hasValidDates) {
      const message = "Missing booking details. Please go back and select a time.";
      setError(message);
      showToast("error", message);
      setIsLoading(false);
      return;
    }

    try {
      const csrfToken = await fetchCsrfToken();
      if (!csrfToken) {
        const message = "Unable to initialize booking. Please refresh and try again.";
        setError(message);
        showToast("error", message);
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          psychologistId,
          date: start!.toISOString(),
          startTime: start!.toISOString(),
          endTime: end!.toISOString(),
          duration: durationMinutes,
          type: "VIDEO",
        }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message = data?.error || "Failed to create appointment.";
        setError(message);
        showToast("error", message);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      const message = `Payment successful. Appointment booked for ${dateLabel} at ${timeLabel}.`;
      setSuccessMessage(message);
      showToast("success", "Paid successfully. Redirecting to your appointments...");
      setIsLoading(false);

      setTimeout(() => {
        router.push("/patient/dashboard/appointments");
      }, 1800);
    } catch {
      const message = "Payment failed. Please try again.";
      setError(message);
      showToast("error", message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#FFF4EA_0%,_#F6F2EA_45%,_#EFE7D8_100%)] px-4 py-6 md:px-8 md:py-8">
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 rounded-xl px-4 py-3 shadow-lg border text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-[#121E0D] mb-6 font-heading text-center lg:text-left">
          Secure Checkout
        </h1>

        <div className="grid lg:grid-cols-12 gap-8 xl:gap-12">
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white/95 backdrop-blur p-6 rounded-2xl border border-[#E8E0D0] shadow-[0_12px_30px_rgba(18,30,13,0.08)]">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CreditCard className="text-[#FC7D45]" />
                Payment Details
              </h2>

              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="e.g. John Doe"
                    required
                    className="h-12 bg-[#FFFBF4] border-[#E8E0D0]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      required
                      className="h-12 bg-[#FFFBF4] border-[#E8E0D0] pl-12"
                    />
                    <CreditCard
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      required
                      className="h-12 bg-[#FFFBF4] border-[#E8E0D0]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <div className="relative">
                      <Input
                        id="cvc"
                        placeholder="123"
                        required
                        className="h-12 bg-[#FFFBF4] border-[#E8E0D0]"
                      />
                      <Lock
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-[#FC7D45] hover:bg-[#E56A35] text-white shadow-lg shadow-orange-100 rounded-xl mt-4"
                >
                  {isLoading ? "Processing..." : `Pay ${price}`}
                </Button>

                {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
                {success && !error && successMessage && (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <p className="text-sm text-emerald-700">{successMessage}</p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-4">
                  <ShieldCheck size={16} className="text-teal-600" />
                  <span className="font-medium">
                    Payments are secure and encrypted
                  </span>
                </div>
              </form>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur p-6 rounded-2xl border border-[#E8E0D0] shadow-[0_12px_30px_rgba(18,30,13,0.08)] lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#EEE4D4]">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                  {doctorPreview.image ? (
                    <img
                      src={doctorPreview.image}
                      alt={doctorPreview.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{doctorPreview.name}</h3>
                  <p className="text-slate-500 text-sm">{doctorPreview.credentials}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600">
                  <span>Date</span>
                  <span className="font-medium text-slate-900">{dateLabel}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Time</span>
                  <span className="font-medium text-slate-900">{timeLabel}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Duration</span>
                  <span className="font-medium text-slate-900">
                    {durationMinutes} mins
                  </span>
                </div>
              </div>

              <Separator className="mb-4 bg-[#EEE4D4]" />

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-[#FC7D45]">{price}</span>
              </div>

              <div className="bg-teal-50 p-4 rounded-xl text-teal-800 text-sm flex gap-3 border border-teal-100">
                <CheckCircle size={20} className="flex-shrink-0" />
                <p>
                  Free cancellation up to 24 hours before the appointment time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
