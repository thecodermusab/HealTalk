"use client";

import DraggableSection from "./DraggableSection";
import { BRAND_LOGOS } from "./about/brand-logos";

export default function TrustedSection() {
  return (
    <section className="py-16 px-6 bg-background">
      <div className="w-full">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12 text-foreground">
          Trusted by Leading Companies
        </h2>

        {/* Draggable Logos Container */}
        <DraggableSection showDragIndicator={true}>
          {BRAND_LOGOS.map((logo) => (
            <div
              key={logo.id}
              className="flex-shrink-0 w-[155px] h-[208px] bg-white rounded-[20px] flex items-center justify-center border border-black/5 shadow-sm pointer-events-none select-none"
            >
              <div className="text-gray-400 opacity-60 transition-opacity duration-300 transform scale-90">
                {logo.svg}
              </div>
            </div>
          ))}
        </DraggableSection>
      </div>
    </section>
  );
}
