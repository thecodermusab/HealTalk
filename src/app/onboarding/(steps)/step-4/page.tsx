"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { SelectionCard } from "@/components/onboarding/SelectionCard";
import { NextButton } from "@/components/onboarding/NextButton";

const FREQUENCY_OPTIONS = [
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "Quarterly",
  "Just once for now"
];

export default function OnboardingStep4() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleToggle = (option: string) => {
    // Single select probably makes more sense here, but keeping multi-select logic to match "exact template" request strictly
    // unless user said otherwise. User said "use the exact design you used for stage 1".
    // Stage 1 is multi-select. I will stick to multi-select behavior for consistency.
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };
  
  const handleNext = () => {
      // Final step -> go home or dashboard
      router.push('/'); 
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      <OnboardingHeader progress={90} />

      {/* Container Padding: Matches Step 1 */}
      <div className="flex-1 flex flex-col items-center pt-[25px] pb-8 px-8 w-full"> 
        <h1 className="text-[20px] font-medium font-figtree text-black text-center mb-2 leading-tight">
          How often do you want to check in?
        </h1>
        <p className="text-[#4b5563] text-[15px] font-medium mb-8 text-center">
          Choose one or more preferences
        </p>

        {/* Gap 16px */}
        <div className="flex flex-col gap-4 items-center w-full">
          {FREQUENCY_OPTIONS.map((option) => (
            <SelectionCard
              key={option}
              label={option}
              selected={selectedOptions.includes(option)}
              onToggle={() => handleToggle(option)}
            />
          ))}
        </div>
      </div>

      <NextButton show={selectedOptions.length > 0} onClick={handleNext} />
    </div>
  );
}
