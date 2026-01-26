"use client";

import { useRef, useState, MouseEvent } from "react";
import { cn } from "@/lib/utils";

// 12 Monochrome SVG Logos (Norwegian/Nordic Tech Context based on About page story)
const LOGOS = [
  {
    id: 1,
    name: "Telenor",
    svg: (
      <svg viewBox="0 0 100 24" fill="currentColor" className="w-24 h-6">
        <path d="M12 12c0-3 .5-5 2-6s4-2 6-2c4 0 6 3 6 8s-2 8-6 8s-6-3-6-8h-2c0 6 3 10 8 10s10-4 10-10S25 2 20 2c-3 0-6 2-8 5V2H10v20h2V12zm25-8h-2v2h2v6h2V6h2V4h-2V2h-2v2zm12 0h-2v12h9v-2h-7V4zm12 0h-2v12h9v-2h-7V4zm14 0h-2v9l-7-9h-2v12h2v-9l7 9h2V4z" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "SpareBank 1",
    svg: (
      <svg viewBox="0 0 120 24" fill="currentColor" className="w-28 h-6">
        <path d="M10 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm50-18C54 4 50 8 50 14s4 10 10 10 10-4 10-10-4-10-10-10zm0 18c-5 0-8-3-8-8s3-8 8-8 8 3 8 8-3 8-8 8zM30 4h-8v18h2v-8h6c4 0 6-2 6-5s-2-5-6-5zm0 8h-6V6h6c3 0 4 1 4 3s-1 3-4 3zm85-8h-4l-3 18h2l1-4h6l1 4h2l-3-18zm-2 12l2-10 2 10h-4z" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Zaptec",
    svg: (
      <svg viewBox="0 0 100 24" fill="currentColor" className="w-24 h-6">
        <path d="M14 2L2 14h10l-2 10 12-14H12l2-8zM40 12l-6-8h-2l6 8-6 8h2l6-8zm10 0c0-4 3-8 8-8s8 4 8 8-3 8-8 8-8-4-8-8zm14 0c0 3-2 6-6 6s-6-3-6-6 2-6 6-6 6 3 6 6zm10 4V8h2v3h6a5 5 0 0 1 0 10h-6v3h-2zm8-5c2 0 4-1 4-3s-2-3-4-3h-4v6h4z" />
      </svg>
    ),
  },
  {
    id: 4,
    name: "TV 2 Play",
    svg: (
      <svg viewBox="0 0 100 24" fill="currentColor" className="w-24 h-6">
         <path d="M10 4H2v4h6v2H2v4h8V4zm10 0h-4v12h2V6h2v10h2V6h2V4h-4zm15 0h-6v12h6c3 0 6-2 6-6s-3-6-6-6zm0 10h-4V6h4c2 0 4 1 4 4s-2 4-4 4zm15-10h-2v12h8v-2h-6V4zm12 0h-2l-4 12h2l1-3h6l1 3h2l-4-12zm-3 7l2-5 2 5hc0 0-4 0-4 0z" />
      </svg>
    ),
  },
  {
    id: 5,
    name: "Vipps",
    svg: (
      <svg viewBox="0 0 80 24" fill="currentColor" className="w-20 h-6">
        <path d="M10 4L6 20H4L0 4h2l2 12L8 4h2zm8 0h-2v16h2V4zm12 0h-6v16h2v-6h4c3 0 5-2 5-5s-2-5-5-5zm-1 8h-3V6h3c2 0 3 1 3 3s-1 3-3 3zm12-8h-6v16h2v-6h4c3 0 5-2 5-5s-2-5-5-5zm-1 8h-3V6h3c2 0 3 1 3 3s-1 3-3 3zm10 4c0-2 2-4 5-4s3 1 3 2h2c0-2-2-4-5-4s-5 2-5 4 2 3 4 3 3 1 3 2-1 2-4 2-4-2-4-2h-2c0 2 2 4 6 4s6-2 6-4-2-3-5-3-4-1-4-2z" />
      </svg>
    ),
  },
  {
    id: 6,
    name: "Superside",
    svg: (
      <svg viewBox="0 0 110 24" fill="currentColor" className="w-26 h-6">
         <path d="M8 8c-2 0-4 1-4 3s2 3 5 3 4-1 4-2h2c0 2-3 4-6 4s-7-2-7-5 3-5 7-5 6 1 6 3h-2c0-1-2-1-5-1zm15-4v10c0 4-3 6-7 6s-7-2-7-6V4h2v10c0 3 2 4 5 4s5-1 5-4V4h2zm10 0h-5v16h2v-6h3c3 0 5-2 5-5s-2-5-5-5zm-1 8h-2V6h2c2 0 3 1 3 3s-1 3-3 3zm15-8h-6v16h6v-2h-4v-5h4v-2h-4V6h4V4zm8 0h-5v16h2v-6h3l2 6h2l-2-6c2 0 3-2 3-4s-1-6-5-6zm-1 8h-2V6h2c2 0 3 1 3 3s-1 3-3 3z" />
      </svg>
    ),
  },
  {
    id: 7,
    name: "Coop",
    svg: (
      <svg viewBox="0 0 80 24" fill="currentColor" className="w-20 h-6">
        <path d="M12 12c0-5 4-8 9-8s8 4 8 9-3 9-8 9-9-4-9-9zm15 0c0-4-3-7-6-7s-6 3-6 7 3 7 6 7 6-3 6-7zm12 0c0-5 4-8 9-8s8 4 8 9-3 9-8 9-9-4-9-9zm15 0c0-4-3-7-6-7s-6 3-6 7 3 7 6 7 6-3 6-7zm12 0c0-5 4-8 9-8s8 4 8 9-3 9-8 9-9-4-9-9zm15 0c0-4-3-7-6-7s-6 3-6 7 3 7 6 7 6-3 6-7zm10 10h-2V4h3c4 0 7 3 7 7s-3 7-7 7h-1v2zm0-4h1c3 0 5-2 5-5s-2-5-5-5h-1v10z" />
      </svg>
    ),
  },
  {
    id: 8,
    name: "Maze",
    svg: (
      <svg viewBox="0 0 90 24" fill="currentColor" className="w-22 h-6">
        <path d="M2 4h4l4 10L14 4h4v16h-4V8l-4 10H8L4 8v12H2V4zm25 0h-2l-5 16h3l1-3h6l1 3h3l-5-16zm-1 11l2-7 2 7h-4zm20-11h-8v2l6 10H38v2h8v-2l-6-10h6V4zm12 0h-6v16h6v-2h-4v-5h4v-2h-4V6h4V4z" />
      </svg>
    ),
  },
  {
    id: 9,
    name: "reMarkable",
    svg: (
      <svg viewBox="0 0 120 24" fill="currentColor" className="w-28 h-6">
        <path d="M4 12c-1 0-2 1-2 2v6h2v-6h2v6h2v-6c0-2-1-3-3-3H4zm14 0h-4v6h4v-2h-2v-1h2v-1h-2v-1h2v-1zm8 0h-2v6h2v-6zm5 0h-2v6h2v-6zm6 0l-3 6h2l1-2h4l1 2h2l-3-6h-4zm3 3l-1-2-1 2h2zm9-3h-4v6h2v-2h1l2 2h2l-2-3c1 0 2-1 2-2s-1-2-2-2zm-1 3h-1v-2h1c1 0 1 .5 1 1s0 1-1 1zm8-3h-2v6h2v-2l2 2h2l-2-2l2-2h-2l-2 2v-2zm8 0h-2l-2 6h2l.5-1.5h3l.5 1.5h2l-2-6zm1.5 3l.5-1.5.5 1.5H94.5zm8-3h-2v6h3c1 0 2-.5 2-2s-1-2-2-2h-1v-1h1c.5 0 1-.2 1-.5S98 12 97.5 12H97v6zm8-6h-2v10h2V6z" />
      </svg>
    ),
  },
  {
    id: 10,
    name: "Kahoot!",
    svg: (
      <svg viewBox="0 0 100 24" fill="currentColor" className="w-24 h-6">
        <path d="M2 2v20h4v-8l6 8h5l-7-8 7-8h-5l-6 6V2H2zm20 10l-4 8h-4l5-10-5-10h4l4 8l4-8h4l-5 10 5 10h-4l-4-8zm15 10V2h-4v20h4zm12-10V8h-2v4h2zm0 6v-4h-2v4h2z M45 4h4v16h-4V4zm14 0h4v6h4V4h4v16h-4v-6h-4v6h-4V4zm20 0h4v16h-4V4z" />
      </svg>
    ),
  },
  {
    id: 11,
    name: "Schibsted",
    svg: (
      <svg viewBox="0 0 110 24" fill="currentColor" className="w-26 h-6">
         <path d="M8 8c-3 0-6 2-6 5s3 5 6 5 6-2 6-5-3-5-6-5zm0 8c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3zm15-8c-3 0-6 2-6 5s3 5 6 5 6-2 6-5-3-5-6-5zm0 8c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3zm15-8h-2v10h2v-3h3c3 0 5-2 5-5s-2-5-5-5h-3v3zm1 0h2c2 0 3 1 3 3s-1 3-3 3h-2V8z" />
      </svg>
    ),
  },
  {
    id: 12,
    name: "Oda",
    svg: (
      <svg viewBox="0 0 80 24" fill="currentColor" className="w-20 h-6">
        <path d="M10 2C5 2 1 6 1 12s4 10 9 10 9-4 9-10S15 2 10 2zm0 16c-3 0-5-3-5-6s2-6 5-6 5 3 5 6-2 6-5 6zm20-16h-8v20h8c5 0 9-4 9-10S35 2 30 2zm-4 16v-12h4c3 0 5 3 5 6s-2 6-5 6h-4zm20 0l-2-4h6l-2 4h-2zm-3-6l3-8 3 8h-6z" />
      </svg>
    ),
  },
];

export default function TrustedLogosCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full select-none">
      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex gap-4 overflow-x-auto pb-8 pt-4 px-4 scrollbar-hide -mx-4 md:mx-0",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        {LOGOS.map((logo) => (
          <div
            key={logo.id}
            className="group relative flex-shrink-0 w-[155px] h-[208px] bg-white rounded-[20px] flex items-center justify-center border border-black/5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300"
          >
            {/* Logo */}
            <div className="text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300 transform scale-90">
              {logo.svg}
            </div>

            {/* Drag Pill (Visible on hover) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
               <div className="bg-[#1a1a1a] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                 Drag
               </div>
            </div>
          </div>
        ))}
        
        {/* Padding spacer for end of list */}
        <div className="w-4 flex-shrink-0 h-10 md:hidden" />
      </div>
    </div>
  );
}
