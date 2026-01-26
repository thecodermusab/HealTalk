"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Data
const LEADERS = [
  {
    id: "esben",
    name: "Esben Poulsen",
    role: "COO / Partner",
    image: null, // Placeholder will be used
    linkedin: "https://linkedin.com",
  },
  {
    id: "fredrik",
    name: "Fredrik Nyquist Langmyhr",
    role: "CEO / Partner",
    image: null,
    linkedin: "https://linkedin.com",
  },
  {
    id: "helle",
    name: "Helle Cecilie Aasen",
    role: "Head of Recruitment",
    image: null,
    linkedin: "https://linkedin.com",
  },
  {
    id: "mark",
    name: "Mark Johnson",
    role: "Senior Partner",
    image: null,
    linkedin: "https://linkedin.com",
  },
  {
    id: "sarah",
    name: "Sarah Williams",
    role: "Director of Talent",
    image: null,
    linkedin: "https://linkedin.com",
  },
  {
    id: "david",
    name: "David Chen",
    role: "Technical Advisor",
    image: null,
    linkedin: "https://linkedin.com",
  },
];

export default function AboutLeaders() {
  const [activeLeaderId, setActiveLeaderId] = useState<string | null>(null);

  const toggleLeader = (id: string) => {
    setActiveLeaderId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-[#fff7f2] w-full py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* 1. Top Centered Text Block */}
      <div className="max-w-xl mx-auto mb-6 text-center">
        <p className="font-heading text-base md:text-lg font-medium text-text-secondary leading-relaxed">
          Today, we’re a team of 70+ full-stack recruiters and talent advisors
          setting a new standard for how ambitious companies find talent.
        </p>
      </div>

      {/* 2. Section Title */}
      <h2 className="font-logo text-4xl md:text-5xl text-foreground text-center mb-16">
        Meet our leaders.
      </h2>

      {/* 3. Leaders Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {LEADERS.map((leader) => {
          const isActive = activeLeaderId === leader.id;

          return (
            <button
              key={leader.id}
              onClick={() => toggleLeader(leader.id)}
              className={cn(
                "group relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden transition-all duration-300 ease-out text-left focus:outline-none focus:ring-4 focus:ring-accent/50",
                isActive ? "bg-[#d5f567]" : "bg-transparent" // Highlight background (Accent Lime)
              )}
              aria-pressed={isActive}
            >
              {/* Leader Image */}
              <div className="absolute inset-x-0 top-0 bottom-[10%] overflow-hidden rounded-t-[2rem] rounded-b-[1rem]">
                 {/* 
                     Using a div placeholder for now. 
                     In production: <Image src={leader.image} fill className={...} />
                 */}
                  <div 
                    className={cn(
                        "w-full h-full bg-gray-300 transition-all duration-500",
                        isActive ? "grayscale-0" : "grayscale"
                    )}
                  >
                     {/* Placeholder Icon/Text */}
                     <div className="flex items-center justify-center w-full h-full text-foreground/30 font-bold text-4xl">
                         {leader.name.split(' ')[0][0]}
                     </div>
                  </div>
              </div>

              {/* Bottom Panel */}
              <div
                className={cn(
                  "absolute bottom-4 left-4 right-4 rounded-xl transition-all duration-300 flex flex-col justify-end px-4 py-3",
                  isActive
                    ? "bg-[#c4c4ff] h-[110px]" // Expanded Purple Panel
                    : "bg-[#f5ebe6] h-[60px]" // Default Off-white Panel
                )}
              >
                {/* Name */}
                <span className="text-foreground font-bold text-lg leading-tight truncate">
                  {leader.name}
                </span>

                {/* Expanded Info (Role + LinkedIn) */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 flex flex-col gap-1",
                    isActive ? "opacity-100 mt-1 max-h-20" : "opacity-0 max-h-0"
                  )}
                >
                  <span className="text-xs font-medium text-foreground/80 uppercase tracking-wide">
                    {leader.role}
                  </span>
                  <Link
                    href={leader.linkedin}
                    target="_blank"
                    className="text-foreground underline decoration-1 underline-offset-2 text-sm font-medium hover:text-foreground/80 w-fit pointer-events-auto"
                    onClick={(e) => e.stopPropagation()} // Prevent card click
                  >
                    LinkedIn
                  </Link>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
