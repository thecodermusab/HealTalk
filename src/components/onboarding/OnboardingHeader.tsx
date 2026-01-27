import { User } from "lucide-react";

interface OnboardingHeaderProps {
  progress: number;
}

export function OnboardingHeader({ progress }: OnboardingHeaderProps) {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 pt-8 pb-4">
      {/* Logo mark - Leaf/Plant style */}
      <div className="text-[#34D399]">
         {/* Simple custom SVG to match the "Leaf" logo in screenshot */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#1ca55e]" 
        >
          <path
            d="M12 21C12 21 16 16.5 16 11C16 7 14 5 12 5C10 5 8 7 8 11C8 16.5 12 21 12 21Z"
            fill="currentColor"
          />
          <path
            d="M12 21V11"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 5C12 5 8 3 6 5C4 7 5 10 8 11"
            stroke="currentColor"
            strokeWidth="2" 
            strokeLinecap="round"
            strokeLinejoin="round" 
            fillOpacity="0"
          />
          <path 
             d="M12 5C12 5 16 3 18 5C20 7 19 10 16 11"
             stroke="currentColor" 
             strokeWidth="2"
             strokeLinecap="round"
             strokeLinejoin="round"
             fillOpacity="0"
          />
          <circle cx="12" cy="3" r="1.5" fill="currentColor"/>
        </svg>
      </div>

      {/* Progress Row */}
      <div className="flex items-center gap-4 w-full px-4 mb-0">
        {/* Progress Bar - Custom Pill */}
        <div className="h-[10px] flex-1 bg-[#C8DDD9] rounded-full overflow-hidden relative">
            {/* Filled portion - Dynamic */}
            <div 
              className="absolute top-0 left-0 h-full bg-[#2D8B5E] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }} 
            />
        </div>

        {/* User Icon Button */}
        <button className="flex-shrink-0 w-[48px] h-[48px] bg-[#1ca55e] rounded-xl flex items-center justify-center shadow-sm">
          <User className="text-white w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
