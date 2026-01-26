"use client";

import DraggableSection from "./DraggableSection";
import { BRAND_LOGOS } from "./about/brand-logos";

export default function TrustedSection() {
  return (
    <section className="py-16 px-6 bg-[#F7F2EB]">
      <div className="w-full max-w-[1470px] mx-auto">
        {/* Heading */}
        <h2 className="text-[32px] md:text-[40px] font-heading font-bold text-center mb-12 text-[#111827] tracking-tight">
          Trusted by the creme de la creme.
        </h2>

        {/* Draggable Logos Container */}
        <DraggableSection showDragIndicator={true}>
          {BRAND_LOGOS.map((logo) => (
            <div
              key={logo.id}
              className="flex-shrink-0 w-[240px] h-[160px] bg-white rounded-[16px] flex items-center justify-center shadow-sm pointer-events-none select-none transition-shadow duration-300 hover:shadow-md"
            >
              <div className="text-[#111827] scale-75">
                {logo.svg}
              </div>
            </div>
          ))}
        </DraggableSection>
      </div>
    </section>
  );
}
