"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { SelectionCard } from "@/components/onboarding/SelectionCard";
import { NextButton } from "@/components/onboarding/NextButton";

// The options match the screenshot exact order
const OPTIONS = [
  "Get financial advice from a pro",
  "Plan for the future",
  "Make progress towards goals",
  "Develop better habits with money",
  "Get organized",
  "Increase my net worth",
  "Get my finances on track",
];

export default function OnboardingStep1() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );

    // Prompt mentions Reuse template for step 2.
    // For now, next button should just go to a dummy step 2 or similar.
    // But since the task only explicitly requested Step 1 details and general "Step 2 exists"
    // I will act as if step 2 route exists or just log it for now if step 2 isn't created yet.
    // However, the deliverables asked for "Step 2 can reuse the same template...".
    // I should probably point next button to /onboarding/step-2 
  };
  
  const handleNext = () => {
      // Navigate to step 2 (could be same component with different data, or simple placeholder)
      router.push('/onboarding/step-2'); 
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      <OnboardingHeader progress={15} />

      {/* Container Padding: User requested 45px gap */}
      {/* 
         Previous Header has 0 margin bottom now.
         We need 45px top margin or padding here for the gap.
      */}
      <div className="flex-1 flex flex-col items-center pt-[25px] pb-8 px-8 w-full"> 
        <h1 className="text-[20px] font-medium font-figtree text-black text-center mb-2 leading-tight">
          Why are you thinking about joining Fruitful?
        </h1>
        <p className="text-[#4b5563] text-[15px] font-medium mb-8 text-center">
          Choose as many as you'd like
        </p>

        {/* Gap 16px */}
        <div className="flex flex-col gap-4 items-center w-full">
          {OPTIONS.map((option) => (
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
