"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Psychologist } from "@/lib/types";
import { Mail, Video, Calendar, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BookingCalendar from "./BookingCalendar";
import { startTherapistConversation } from "@/lib/start-therapist-conversation";

interface ConnectCardProps {
  therapist: Psychologist;
}

export default function ConnectCard({ therapist }: ConnectCardProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const buildStartTime = (selectedDate: Date, selectedTime: string) => {
    const [timePart, meridiem] = selectedTime.split(" ");
    const [rawHours, rawMinutes] = timePart.split(":").map(Number);
    let hours = rawHours;
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    const start = new Date(selectedDate);
    start.setHours(hours, rawMinutes, 0, 0);
    return start;
  };

  const handleSlotSelect = (d: Date, t: string) => {
      setDate(d);
      setTime(t);
  };

  const handleMessageNow = async () => {
    if (isStartingChat) return;
    setIsStartingChat(true);
    setChatError(null);

    const result = await startTherapistConversation({
      psychologistId: String(therapist.id),
    });

    if (!result.ok) {
      if (result.shouldLogin) {
        router.push(`/login?redirect=${encodeURIComponent(`/psychologists/${String(therapist.id)}`)}`);
        return;
      }
      setChatError(result.error);
      setIsStartingChat(false);
      return;
    }

    router.push(
      `/patient/dashboard/messages?appointmentId=${encodeURIComponent(result.conversationId)}`
    );
  };

  return (
    <div className="space-y-4">
        {/* Main Card */}
        <div className="bg-white border border-[#E8E0D0] rounded-2xl p-6 shadow-[0_10px_30px_rgba(18,30,13,0.08)]">
        <h3 className="text-xl font-bold text-slate-900 mb-5">Let&apos;s Connect</h3>
        
        <div className="space-y-3 mb-6">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full h-12 text-lg font-semibold bg-[#FC7D45] hover:bg-[#e06935] text-white shadow-md shadow-orange-100 transition-all">
                        <Calendar size={20} className="mr-2" />
                        Book Appointment
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-[min(900px,calc(100vw-1rem))] max-w-[900px] max-h-[85dvh] p-0 gap-0 overflow-hidden flex flex-col md:flex-row bg-[#FFFDF8] border-[#E8E0D0]">
                    {/* Left Side: Calendar */}
                    <div className="flex-1 p-4 sm:p-6 md:border-r border-slate-100 bg-white overflow-y-auto">
                        <BookingCalendar 
                            onSelectSlot={handleSlotSelect} 
                            selectedDate={date}
                            selectedTime={time}
                        />
                    </div>

                    {/* Right Side: Summary & Confirm */}
                    <div className="w-full md:w-[300px] bg-gradient-to-b from-[#FFF4EA] to-[#FFFDF8] p-4 sm:p-6 flex flex-col h-full overflow-y-auto">
                        <div className="mb-6">
                            <DialogTitle className="text-xl font-bold text-slate-900 mb-1">Book Session</DialogTitle>
                            <DialogDescription className="text-sm text-slate-500">with {therapist.name}</DialogDescription>
                        </div>
                        
                        <div className="space-y-4 mb-auto">
                            <div className="bg-white p-3 rounded-xl border border-[#E8E0D0] shadow-sm">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Date & Time</span>
                                <div className="text-slate-900 font-medium flex items-center gap-2">
                                    <Calendar size={16} className="text-[#FC7D45]" />
                                    {date && time ? (
                                        <span>
                                            {date.toLocaleDateString()} at {time}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 italic">Select a slot...</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="bg-white p-3 rounded-xl border border-[#E8E0D0] shadow-sm hidden md:block">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Fee</span>
                                <div className="text-slate-900 font-medium">
                                    {therapist.priceRange?.split(' ')[0] || '$50'} / session
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                disabled={!date || !time}
                                onClick={() => {
                                    if (date && time) {
                                        const price = therapist.priceRange?.split(' ')[0] || '$50';
                                        const start = buildStartTime(date, time);
                                        const end = new Date(start.getTime() + 60 * 60 * 1000);
                                        const doctorImage = therapist.image || therapist.photo || "";
                                        router.push(`/checkout?psychologistId=${encodeURIComponent(therapist.id)}&doctor=${encodeURIComponent(therapist.name || 'Therapist')}&doctorImage=${encodeURIComponent(doctorImage)}&start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}&time=${encodeURIComponent(time)}&price=${encodeURIComponent(price)}`);
                                    }
                                }}
                                className="w-full h-12 text-base font-bold bg-[#FC7D45] hover:bg-[#e06935] text-white shadow-lg shadow-orange-100 rounded-xl disabled:opacity-50 disabled:shadow-none"
                            >
                                Confirm Booking
                            </Button>
                            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-3">
                                <CheckCircle size={12} />
                                <span>Free cancellation 24h before</span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            
            <Button
                variant="outline"
                onClick={handleMessageNow}
                disabled={isStartingChat}
                className="w-full h-12 text-base font-medium border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all"
            >
                <Mail size={18} className="mr-2" />
                {isStartingChat ? "Opening Chat..." : "Message Now"}
            </Button>
            {chatError && (
              <p className="text-xs text-red-600 text-center -mt-1">{chatError}</p>
            )}
        </div>

        <div className="space-y-3 pt-2 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
                <Video size={16} className="text-[#FC7D45]" />
                <span className="font-medium">Available Online & In-Person</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
                 <span className="text-[#FC7D45] font-bold text-lg w-5 flex justify-center">$</span>
                 <span className="font-bold text-slate-900">{therapist.priceRange?.split(' ')[0] || '$50'}</span>
                 <span className="text-slate-500">per session</span>
            </div>
        </div>
        </div>

    </div>
  );
}
