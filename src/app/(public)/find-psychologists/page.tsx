"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FilterBar, { FilterState } from "@/components/psychologists/FilterBar";
import TherapistListCard from "@/components/psychologists/TherapistListCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";

interface PsychologistFromAPI {
  id: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  credentials: string;
  experience: number;
  bio: string;
  specializations: string[];
  price60: number;
  price90: number;
  rating: number;
  reviewCount: number;
  user: {
    name: string;
    image: string | null;
  };
  hospital: {
    name: string;
    location: string;
  } | null;
}

interface TherapistHighlight {
  icon: string;
  label: string;
  color: string;
}

interface TherapistCardData {
  id: string;
  name: string;
  title: string;
  image: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  location: string;
  priceRange: string;
  languages: string[];
  conditions: string[];
  about: string;
  experience: number;
  sessionDuration: string;
  nextAvailable: string;
  highlights: TherapistHighlight[];
  insurances?: string[];
}

export default function FindPsychologistsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    location: [],
    insurance: [],
    language: [],
    conditions: [],
    priceRange: [],
    ethnicity: []
  });
  const [psychologists, setPsychologists] = useState<TherapistCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [devPendingNotice, setDevPendingNotice] = useState(false);
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const booked = searchParams?.get("booked");
    if (booked !== "1") {
      setBookingNotice(null);
      return;
    }

    const bookedDate = searchParams?.get("bookedDate");
    const bookedTime = searchParams?.get("bookedTime");
    if (bookedDate && bookedTime) {
      setBookingNotice(`You booked appointment on ${bookedDate} at ${bookedTime}.`);
      return;
    }

    setBookingNotice("Your appointment was booked successfully.");
  }, [searchParams]);

  useEffect(() => {
    const fetchPsychologists = async () => {
      setLoading(true);
      setFetchError(null);
      setDevPendingNotice(false);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
        });

        // Add specialization filter (use first condition as specialization)
        if (filters.conditions.length > 0) {
          params.append('specialization', filters.conditions[0]);
        }

        const res = await fetch(`/api/psychologists?${params}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setFetchError(typeof data?.error === "string" ? data.error : "Unable to load psychologists right now.");
          if (page === 1) {
            setPsychologists([]);
            setTotalPages(1);
          }
          return;
        }

        const apiPsychologists: PsychologistFromAPI[] = Array.isArray(data?.psychologists)
          ? data.psychologists
          : [];
        setDevPendingNotice(Boolean(data?.showingPendingFallback));

        // Transform API data to match component expectations
        const transformedData = apiPsychologists.map((p) => ({
          id: p.id,
          name: p.user?.name || 'Therapist',
          title: p.credentials,
          image: p.user?.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
          verified: p.status === "APPROVED",
          rating: p.rating,
          reviewCount: p.reviewCount,
          location: p.hospital?.location || 'Remote',
          priceRange: `$${(p.price60 / 100).toFixed(0)} - $${(p.price90 / 100).toFixed(0)}`,
          languages: ['English'], // Default since not in DB yet
          conditions: p.specializations,
          about: p.bio,
          experience: p.experience,
          sessionDuration: '50 min',
          nextAvailable: 'Tomorrow',
          highlights: [{ icon: "Video", label: "Available Online", color: "bg-green-100 text-green-800" }],
        }));

        setPsychologists((prev) => (page === 1 ? transformedData : [...prev, ...transformedData]));
        setTotalPages(Number(data?.pagination?.totalPages) || 1);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load psychologists right now.";
        setFetchError(message);
        if (page === 1) {
          setPsychologists([]);
          setTotalPages(1);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, [filters, page]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  // Client-side filtering for filters not yet implemented in API
  const filteredPsychologists = psychologists.filter((psych) => {
    // Location Filter (client-side for now)
    if (filters.location.length > 0) {
      const isOnlineSelected = filters.location.some((l) => l.includes("Online"));
      const isOnline = psych.highlights?.some((h) => h.label === "Available Online") || psych.location.toLowerCase().includes("online");
      const locationMatch = filters.location.some((l) => psych.location.includes(l));

      if (!((isOnlineSelected && isOnline) || locationMatch)) {
         return false;
      }
    }

    // Language Filter (client-side for now)
    if (filters.language.length > 0) {
       const hasLanguage = filters.language.some(l => psych.languages.includes(l));
       if (!hasLanguage) return false;
    }

    // Insurance Filter (client-side for now)
    if (filters.insurance.length > 0) {
      if (!psych.insurances) return false;
      const hasInsurance = filters.insurance.some((i: string) => psych.insurances?.includes(i));
      if (!hasInsurance) return false;
    }

    // Price Filter (client-side for now)
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
        {bookingNotice && (
          <div className="mb-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            {bookingNotice}
          </div>
        )}
        <FilterBar activeFilters={filters} onApplyFilters={handleApplyFilters} />

        {/* Results List */}
        <div className="space-y-4">
           {devPendingNotice && (
              <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                Showing pending doctors in development mode because no approved doctors were found yet.
              </div>
           )}
           {loading ? (
              <div className="text-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
                  <p className="text-slate-500">Loading psychologists...</p>
              </div>
           ) : filteredPsychologists.length > 0 ? (
              filteredPsychologists.map((psych) => (
                <TherapistListCard key={psych.id} therapist={psych} />
              ))
           ) : (
               <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                   <p className="text-lg font-medium text-slate-700">
                     {fetchError ? "We could not load psychologists right now." : "No psychologists match your current filters."}
                   </p>
                   <p className="text-slate-400 text-sm mt-1">
                     {fetchError ? fetchError : "Try adjusting your filters or search criteria."}
                   </p>
                   <Button variant="link" onClick={() => { setFilters({location:[], insurance:[], language:[], conditions:[], priceRange:[], ethnicity:[]}); setPage(1); }} className="text-primary mt-4">Clear all filters</Button>
               </div>
           )}
        </div>

        {/* Pagination / Load More */}
        {!loading && filteredPsychologists.length > 0 && page < totalPages && (
            <div className="mt-12 text-center pb-12">
                 <Button
                    variant="outline"
                    size="lg"
                    className="min-w-[200px] border-slate-200 text-slate-600 hover:bg-slate-50"
                    onClick={() => setPage(page + 1)}
                 >
                    Load More Results
                 </Button>
            </div>
        )}

      </div>
    </div>
  );
}
