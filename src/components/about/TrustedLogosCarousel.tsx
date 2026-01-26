"use client";

import { motion, useAnimationControls, PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BRAND_LOGOS } from "./brand-logos";

// Triplicate the logos to ensure seamless looping during drag/scroll
const REPEATED_LOGOS = [...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS];

export default function TrustedLogosCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [isDragging, setIsDragging] = useState(false);
  
  // Use a ref to track the current animation frame for auto-scroll
  const autoScrollRef = useRef<number>(null);
  
  // Track x position for seamless reset
  const xPosRef = useRef(0);
  const draggingRef = useRef(false);

  // Card dimensions + gap
  const CARD_WIDTH = 155;
  const GAP = 16;
  const TOTAL_ITEM_WIDTH = CARD_WIDTH + GAP;
  
  // We want to loop when we've scrolled past the first set of logos
  const LOOP_WIDTH = BRAND_LOGOS.length * TOTAL_ITEM_WIDTH;

  useEffect(() => {
    let lastTime = performance.now();
    const speed = 0.5; // pixels per ms (adjust for auto-scroll speed)

    const animate = (time: number) => {
      if (!draggingRef.current) {
        const delta = time - lastTime;
        xPosRef.current -= (speed * delta) / 16; // Normalize speed
        
        // Seamless Loop Logic
        if (xPosRef.current <= -LOOP_WIDTH) {
          xPosRef.current += LOOP_WIDTH;
        } else if (xPosRef.current > 0) {
          xPosRef.current -= LOOP_WIDTH;
        }

        controls.set({ x: xPosRef.current });
      }
      
      lastTime = time;
      autoScrollRef.current = requestAnimationFrame(animate);
    };

    autoScrollRef.current = requestAnimationFrame(animate);

    return () => {
      if (autoScrollRef.current) cancelAnimationFrame(autoScrollRef.current);
    };
  }, [LOOP_WIDTH, controls]);

  const onDragStart = () => {
    setIsDragging(true);
    draggingRef.current = true;
    document.body.style.cursor = "grabbing";
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    draggingRef.current = false;
    document.body.style.cursor = "";
    
    // Resume auto-scroll from current position, but ensure we snap/flow correctly if needed.
    // In this simple continuous loop, we just let the animation loop pick up xPosRef.
  };

  const onDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    xPosRef.current += info.delta.x;
  };

  return (
    <div className="w-full relative overflow-hidden group">
      {/* Title - Positioned above the carousel as requested in layout refactor */}
      <div className="text-center mb-8">
         {/* Title is handled by parent, but we ensure spacing here */}
      </div>

      <motion.div
        ref={containerRef}
        className={cn(
          "flex gap-4 cursor-grab active:cursor-grabbing",
          isDragging && "cursor-grabbing"
        )}
        drag="x"
        dragConstraints={{ left: -10000, right: 10000 }} // Infinite drag feeling
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        animate={controls}
        style={{ width: "max-content" }}
        whileTap={{ cursor: "grabbing" }}
      >
        {REPEATED_LOGOS.map((logo, index) => (
          <div
            // Use index key because we have duplicates
            key={`${logo.id}-${index}`}
            className="group/card relative flex-shrink-0 w-[155px] h-[208px] bg-white rounded-[20px] flex items-center justify-center border border-black/5 shadow-sm transition-all duration-300 select-none overflow-hidden"
          >
            {/* Logo */}
            <div className="text-gray-400 opacity-60 group-hover/card:opacity-100 transition-opacity duration-300 transform scale-90 pointer-events-none">
              {logo.svg}
            </div>

            {/* Drag Pill (Visible on hover over the track/card) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/card:translate-y-0 pointer-events-none">
               <div className="bg-[#1a1a1a] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                 Drag
               </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
