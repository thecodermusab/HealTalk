"use client";

import DraggableSection from "@/components/DraggableSection";
import InfiniteLogoCarousel from "@/components/InfiniteLogoCarousel";

export default function TestDragPage() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <h1 className="text-4xl font-bold mb-8 text-center">Drag Test Page</h1>

      {/* NEW: Infinite Logo Carousel Demo */}
      <div className="mb-12 -mx-8">
        <h2 className="text-2xl font-semibold mb-4 px-8">Test 0: Infinite Auto-Scrolling Carousel (Premium)</h2>
        <InfiniteLogoCarousel />
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Test 1: Simple Cards</h2>
        <DraggableSection showDragIndicator={true}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <div
              key={num}
              className="flex-shrink-0 min-w-[300px] h-40 bg-white rounded-lg shadow-md flex items-center justify-center text-2xl font-bold"
              style={{ pointerEvents: "none" }}
            >
              Card {num}
            </div>
          ))}
        </DraggableSection>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Test 2: Logo Cards (Exact Design)</h2>
        <DraggableSection showDragIndicator={true}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <div
              key={num}
              className="flex-shrink-0 w-[240px] h-[160px] bg-white rounded-[16px] shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
              style={{ pointerEvents: "none" }}
            >
              <span className="text-gray-800 text-xl font-bold">Logo {num}</span>
            </div>
          ))}
        </DraggableSection>
      </div>

      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-2">Testing Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Hover over the cards - you should see a "Drag" indicator appear in top-right</li>
          <li>Cursor should change to a grab hand icon</li>
          <li>Click and hold, then move left/right - cards should scroll</li>
          <li>While dragging, cursor should change to grabbing hand</li>
          <li>Indicator should change to "Dragging..."</li>
        </ol>
      </div>
    </div>
  );
}
