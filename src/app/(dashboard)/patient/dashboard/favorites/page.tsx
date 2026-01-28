"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Heart, Star, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const favoritePsychologists = [
    {
      id: 1,
      name: "Dr. Ahmet Yılmaz",
      credentials: "PhD, Clinical Psychologist",
      rating: 4.8,
      reviewCount: 120,
      specializations: ["Anxiety Disorders", "Depression"],
      hospital: "Acıbadem Hospital",
      location: "Istanbul",
      price: 450,
      image: "/images/doctor1.png"
    },
    {
      id: 2,
      name: "Dr. Ayşe Demir",
      credentials: "PhD, Clinical Psychologist",
      rating: 4.9,
      reviewCount: 89,
      specializations: ["Trauma & PTSD", "Family Therapy"],
      hospital: "Memorial Hospital",
      location: "Istanbul",
      price: 500,
      image: "/images/doctor2.png"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Favorite Psychologists</h1>
          <p className="text-gray-500">
            Psychologists you've saved for quick access
          </p>
        </div>

        {/* Favorites Grid */}
        {favoritePsychologists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favoritePsychologists.map((psychologist) => (
              <div
                key={psychologist.id}
                className="bg-white border border-[#E6EAF2] rounded-[16px] p-2 hover:shadow-[0_8px_24px_rgba(17,24,39,0.04)] hover:border-[#5B6CFF] transition-all group duration-300"
              >
                {/* Photo Area */}
                <div className="relative h-48 rounded-xl bg-gray-100 overflow-hidden mb-4">
                   {/* Placeholder for real image, using colored div for now if image fails login */}
                   <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                      <span className="text-4xl font-bold opacity-20">{psychologist.name[0]}</span>
                   </div>
                   {/* Heart Button */}
                   <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[#FF4D4F] hover:bg-white transition-all shadow-sm z-10">
                     <Heart size={18} fill="#FF4D4F" />
                   </button>
                   {/* Rating Badge */}
                   <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                      <Star className="text-[#FF9F43] fill-[#FF9F43]" size={14} />
                      <span className="text-sm font-bold text-gray-900">{psychologist.rating}</span>
                      <span className="text-xs text-gray-500">({psychologist.reviewCount})</span>
                   </div>
                </div>

                <div className="px-2 pb-2">
                    {/* Info */}
                    <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#5B6CFF] transition-colors">
                        {psychologist.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        {psychologist.credentials}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {psychologist.specializations.slice(0, 2).map((spec) => (
                            <span key={spec} className="px-2.5 py-1 bg-[#F4F7FF] text-[#5B6CFF] text-[10px] font-bold rounded-md">
                            {spec}
                            </span>
                        ))}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 px-1">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{psychologist.hospital}, {psychologist.location}</span>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-medium uppercase">Session Fee</span>
                            <span className="text-lg font-bold text-gray-900">₺{psychologist.price}</span>
                        </div>
                        <Link href={`/psychologist/${psychologist.id}?book=true`}>
                            <Button size="sm" className="bg-[#5B6CFF] hover:bg-[#4a5ae0] rounded-lg shadow-sm shadow-blue-500/20">
                                Book Now
                            </Button>
                        </Link>
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-[24px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Favorites Yet
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              You haven't saved any psychologists yet. Browse our list to find specialists that match your needs.
            </p>
            <Link href="/find-psychologists">
              <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0] gap-2 h-11 px-6">
                Find Psychologists <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
