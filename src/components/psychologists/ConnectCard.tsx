"use client";

import { Button } from "@/components/ui/button";
import { Psychologist } from "@/lib/mock-data";
import { Info, Mail, Phone, Video } from "lucide-react";

interface ConnectCardProps {
  therapist: Psychologist;
}

export default function ConnectCard({ therapist }: ConnectCardProps) {
  return (
    <div className="space-y-4 sticky top-24">
        {/* Main Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-5">Let's Connect</h3>
        
        <div className="space-y-3 mb-6">
            <Button className="w-full h-12 text-lg font-semibold bg-[#FC7D45] hover:bg-[#e06935] text-white shadow-md shadow-orange-100 transition-all">
                <Phone size={20} className="mr-2 fill-current" />
                Book Appointment
            </Button>
            
            <Button variant="outline" className="w-full h-12 text-base font-medium border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all">
                <Mail size={18} className="mr-2" />
                Send Email
            </Button>
        </div>

        <div className="space-y-3 pt-2 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
                <Video size={16} className="text-[#FC7D45]" />
                <span className="font-medium">Available Online & In-Person</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
                 <span className="text-[#FC7D45] font-bold text-lg w-5 flex justify-center">$</span>
                 <span className="font-bold text-slate-900">{therapist.priceRange.split(' ')[0]}</span>
                 <span className="text-slate-500">per session</span>
            </div>
        </div>
        </div>

        {/* Free Consultation Pill */}
        <div className="bg-slate-100/80 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-700 font-medium text-sm border border-slate-200/50">
            <span>Free 30 minutes Consultation</span>
            <Info size={16} className="text-slate-400" />
        </div>
    </div>
  );
}
