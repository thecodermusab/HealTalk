"use client";

import { Check } from "lucide-react";

interface SelectionCardProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export function SelectionCard({ label, selected, onToggle }: SelectionCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative w-[490px] h-[50px] text-left rounded-[16px] pl-6
        transition-all duration-200 group flex items-center
        ${
          selected
            ? "bg-[#EFFFFA] border-[#408954]" // Selected overrides default BG? 
            // Prompt says: "Background changes to a very light green tint" for selected.
            // Prompt says default: "Change background color from white (#FFFFFF) to cream/beige (#F5F1E8)"
            : "bg-[#F5F1E8] border-transparent hover:bg-[#eae6dd]"
        }
      `}
      style={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        // Override minimal height/width if needed, but tailwind class handles it
      }}
    >
      <div className="flex-1 flex items-center justify-between w-full pr-4">
        <span className="font-figtree font-semibold text-black text-[14px]">
          {label}
        </span>
        
        {/* Selection Indicator */}
        {selected && (
          <div className="flex-shrink-0 ml-3">
            <div className="w-6 h-6 rounded-full bg-[#408954] flex items-center justify-center">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
