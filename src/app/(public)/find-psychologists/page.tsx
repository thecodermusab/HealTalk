"use client";

import { useState } from "react";
import FilterBar, { FilterState } from "@/components/psychologists/FilterBar";
import TherapistListCard from "@/components/psychologists/TherapistListCard";
import { psychologists } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function FindPsychologistsPage() {
  const [filters, setFilters] = useState<FilterState>({
    location: [],
    insurance: [],
    language: [],
    conditions: [],
    priceRange: [],
    ethnicity: []
  });

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const filteredPsychologists = psychologists.filter((psych) => {
    // Location Filter
    if (filters.location.length > 0) {
      const isOnlineSelected = filters.location.some(l => l.includes("Online"));
      const isOnline = psych.highlights?.some(h => h.label === "Available Online") || psych.location.toLowerCase().includes("online");
      const locationMatch = filters.location.some(l => psych.location.includes(l)); 

      if (!((isOnlineSelected && isOnline) || locationMatch)) {
         return false;
      }
    }

    // Condition Filter
    if (filters.conditions.length > 0) {
      const hasCondition = filters.conditions.some(c => psych.conditions.includes(c));
      if (!hasCondition) return false;
    }

    // Language Filter
    if (filters.language.length > 0) {
       const hasLanguage = filters.language.some(l => psych.languages.includes(l));
       if (!hasLanguage) return false;
    }

    // Insurance Filter
    if (filters.insurance.length > 0) {
      if (!psych.insurances) return false; 
      const hasInsurance = filters.insurance.some(i => psych.insurances?.includes(i));
      if (!hasInsurance) return false;
    }

    // Price Filter
    if (filters.priceRange.length > 0) {
         const match = psych.priceRange.match(/\$(\d+)/);
         if (match) {
             const price = parseInt(match[1]);
             const matchesLow = filters.priceRange.includes("low") && price < 50;
             const matchesMid = filters.priceRange.includes("mid") && price >= 50 && price <= 60;
             const matchesHigh = filters.priceRange.includes("high") && price > 60;
             if (!matchesLow && !matchesMid && !matchesHigh) return false;
         }
    }

     // Ethnicity Filter - Ignored for now as mock data is missing it
    
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Optional: Top Gradient Wash */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-orange-50/30 to-transparent pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-12 pt-32">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-display">
            Therapists {filters.location.length > 0 
              ? `in ${filters.location.length === 1 ? filters.location[0] : 'Multiple Locations'}`
              : 'Online & Worldwide'}
          </h1>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            {filteredPsychologists.length} results {filters.location.length > 0 && (
                <>in <span className="font-semibold text-slate-900 flex items-center cursor-pointer hover:underline mx-1">
                    {filters.location.length === 1 ? filters.location[0] : `${filters.location.length} locations`} 
                    <ChevronDown size={14} className="ml-0.5" />
                </span></>
            )}
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar activeFilters={filters} onApplyFilters={handleApplyFilters} />

        {/* Results List */}
        <div className="space-y-4">
           {filteredPsychologists.length > 0 ? (
              filteredPsychologists.map((psych) => (
                <TherapistListCard key={psych.id} therapist={psych} />
              ))
           ) : (
               <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                   <p className="text-lg font-medium text-slate-700">No psychologists match your current filters.</p>
                   <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search criteria.</p>
                   <Button variant="link" onClick={() => setFilters({location:[], insurance:[], language:[], conditions:[], priceRange:[], ethnicity:[]})} className="text-primary mt-4">Clear all filters</Button>
               </div>
           )}
        </div>
        
        {/* Pagination / Load More */}
        {filteredPsychologists.length > 0 && (
            <div className="mt-12 text-center pb-12">
                 <Button variant="outline" size="lg" className="min-w-[200px] border-slate-200 text-slate-600 hover:bg-slate-50">
                    Load More Results
                 </Button>
            </div>
        )}

      </div>
    </div>
  );
}
