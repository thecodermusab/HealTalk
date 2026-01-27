"use client";

import React from "react";
import { GuideCard } from "@/components/onboarding/GuideCard";
import { GuideDetailModal } from "@/components/onboarding/GuideDetailModal";

// Mock Data based on user request
// Reusing available images cycling through 1-3
const GUIDES = [
  {
    id: 1,
    name: "Naima Bush",
    imageSrc: "/images/portrait-1.png",
    traits: ["🌟 Cheerful", "🤝 Supportive", "🧩 Collaborative"]
  },
  {
    id: 2,
    name: "Mary Rush",
    imageSrc: "/images/portrait-2.png",
    traits: ["🎉 Motivating", "🚀 Fun", "📚 Educational"] // Adjusted based on visual guess or prompt
  },
  {
    id: 3,
    name: "Alli Hershey",
    imageSrc: "/images/portrait-3.png",
    traits: ["🤝 Trustworthy", "🎉 Fun", "❤️ Empathetic"]
  },
  // Repeating for demo
  {
    id: 4,
    name: "Naima Bush",
    imageSrc: "/images/portrait-1.png",
    traits: ["🌟 Cheerful", "🤝 Supportive", "🧩 Collaborative"]
  },
  {
    id: 5,
    name: "Mary Rush",
    imageSrc: "/images/portrait-2.png",
    traits: ["🎉 Motivating", "🚀 Fun", "📚 Educational"]
  },
  {
    id: 6,
    name: "Alli Hershey",
    imageSrc: "/images/portrait-3.png",
    traits: ["🤝 Trustworthy", "🎉 Fun", "❤️ Empathetic"]
  }
];

// ... imports

export default function ChooseGuidePage() {
  const [selectedGuide, setSelectedGuide] = React.useState<typeof GUIDES[0] | null>(null);

  return (
    // Single page background color/gradient across entire viewport
    <div className="min-h-screen w-full bg-[#D7ECE5] flex flex-col items-center">
      {/* Header Section */}
      <div className="flex flex-col items-center pt-[64px] pb-[56px] px-4 w-full">
        {/* Logo Icon */}
        <div className="mb-[32px] text-[#2D8B5E]">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1ca55e]">
                <path d="M12 21C12 21 16 16.5 16 11C16 7 14 5 12 5C10 5 8 7 8 11C8 16.5 12 21 12 21Z" fill="currentColor"/>
                <path d="M12 21V11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 5C12 5 8 3 6 5C4 7 5 10 8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fillOpacity="0"/>
                <path d="M12 5C12 5 16 3 18 5C20 7 19 10 16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fillOpacity="0"/>
                <circle cx="12" cy="3" r="1.5" fill="currentColor"/>
              </svg>
        </div>

        <h1 className="text-[32px] font-semibold text-[#1A1A1A] text-center mb-2 leading-tight font-sans">
          Choose your Guide
        </h1>
        <p className="text-[16px] font-normal text-[#1A1A1A] text-center font-sans">
          They’re all skilled and supportive CFP® Professionals
        </p>
      </div>

      {/* Grid Section */}
      <div className="w-full flex justify-center pb-20">
        <div className="grid gap-[15px]"
             style={{
               gridTemplateColumns: "repeat(3, 320px)",
             }}
        >
             <style jsx>{`
                div.grid {
                    grid-template-columns: repeat(3, 320px);
                }
                @media (max-width: 1050px) {
                    div.grid {
                        grid-template-columns: repeat(2, 320px);
                    }
                }
                @media (max-width: 700px) {
                    div.grid {
                        grid-template-columns: repeat(1, 320px);
                    }
                }
             `}</style>

            {GUIDES.map((guide) => (
                <GuideCard
                    key={guide.id}
                    name={guide.name}
                    traits={guide.traits}
                    imageSrc={guide.imageSrc}
                    onClick={() => setSelectedGuide(guide)}
                />
            ))}
        </div>
      </div>

      {/* Detail Modal */}
      <GuideDetailModal 
        guide={selectedGuide} 
        isOpen={!!selectedGuide} 
        onClose={() => setSelectedGuide(null)}
        onNext={() => {
          if (!selectedGuide) return;
          const currentIndex = GUIDES.findIndex(g => g.id === selectedGuide.id);
          const nextIndex = (currentIndex + 1) % GUIDES.length;
          setSelectedGuide(GUIDES[nextIndex]);
        }}
        onPrev={() => {
          if (!selectedGuide) return;
          const currentIndex = GUIDES.findIndex(g => g.id === selectedGuide.id);
          const prevIndex = (currentIndex - 1 + GUIDES.length) % GUIDES.length;
          setSelectedGuide(GUIDES[prevIndex]);
        }}
      />
    </div>
  );
}
