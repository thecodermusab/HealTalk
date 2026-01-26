"use client";

import { useRef, useState, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DraggableSectionProps {
  children: ReactNode;
  className?: string;
  showDragIndicator?: boolean;
}

export default function DraggableSection({
  children,
  className,
  showDragIndicator = true,
}: DraggableSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const state = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });

  // Track cursor position for custom drag indicator
  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorPos({ x, y });
    }
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    state.current.isDragging = true;
    state.current.startX = e.clientX;
    state.current.scrollLeft = containerRef.current.scrollLeft;
    setIsDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    handleMouseMove(e);

    if (!state.current.isDragging || !containerRef.current) return;

    const deltaX = e.clientX - state.current.startX;
    state.current.startX = e.clientX;
    containerRef.current.scrollLeft = state.current.scrollLeft - deltaX;
    state.current.scrollLeft = containerRef.current.scrollLeft;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    state.current.isDragging = false;
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className={cn(
          "w-full overflow-x-auto overflow-y-hidden scrollbar-none cursor-none select-none",
          className
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="inline-flex gap-4">{children}</div>
      </div>

      {/* Floating Drag Pill - Follows Cursor */}
      {showDragIndicator && isHovering && (
        <div
          className="absolute top-0 left-0 pointer-events-none z-50 transition-opacity duration-200"
          style={{
            transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
          }}
        >
          <div
            className={cn(
              "translate-x-3 translate-y-3 bg-[#1a1a1a] text-white text-[12px] font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap transition-transform duration-200",
              isDragging && "scale-90"
            )}
          >
            {isDragging ? "Dragging" : "Drag"}
          </div>
        </div>
      )}
    </div>
  );
}
