"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { SelectionCard } from "@/components/onboarding/SelectionCard";
import { NextButton } from "@/components/onboarding/NextButton";

const GOAL_OPTIONS = [
  "Sleep better",
  "Manage anxiety",
  "Feel less overwhelmed",
  "Build confidence",
  "Improve relationships",
  "Process grief",
  "Work through trauma",
  "I am not sure yet"
];

export default function OnboardingStep2() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const maxSelections = 4;
  const limitReached = selectedOptions.length >= maxSelections;

  const handleToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : prev.length >= maxSelections
          ? prev
          : [...prev, option]
    );
  };
  
  const handleNext = () => {
      router.push('/onboarding/step-3'); 
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      <OnboardingHeader progress={40} />

      {/* Container Padding: Matches Step 1 */}
      <div className="flex-1 flex flex-col items-center pt-[25px] pb-8 px-8 w-full"> 
        <h1 className="text-[20px] font-medium font-figtree text-black text-center mb-2 leading-tight">
          What do you want to focus on?
        </h1>
        <p className="text-[#4b5563] text-[15px] font-medium mb-8 text-center">
          Choose up to 4
        </p>

        {/* Gap 16px */}
        <div className="flex flex-col gap-4 items-center w-full">
          {GOAL_OPTIONS.map((option) => (
            <SelectionCard
              key={option}
              label={option}
              selected={selectedOptions.includes(option)}
              onToggle={() => handleToggle(option)}
            />
          ))}
        </div>
        {limitReached && (
          <p className="mt-3 text-xs text-[#4b5563]">
            You can choose up to 4.
          </p>
        )}
      </div>

      <NextButton show={selectedOptions.length > 0} onClick={handleNext} />
    </div>
  );
}
