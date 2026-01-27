"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "@/components/psychologists/SearchBar";
import FilterSidebar from "@/components/psychologists/FilterSidebar";
import PsychologistCard from "@/components/psychologists/PsychologistCard";
import { psychologists } from "@/lib/data";
import { Grid3x3, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FindPsychologistsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("Highest Rated");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    specializations: [] as string[],
    hospitals: [] as string[],
    city: "All Cities",
    rating: null as number | null,
    availability: null as string | null,
    priceRange: { min: 200, max: 1000 },
    languages: [] as string[],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Sort options
  const sortOptions = [
    "Highest Rated",
    "Most Reviews",
    "Soonest Available",
    "Price: Low to High",
    "Price: High to Low",
    "Years of Experience"
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, filters]);

  const filteredPsychologists = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matchesAvailability = (nextAvailable: string) => {
      if (!filters.availability) return true;
      const text = nextAvailable.toLowerCase();
      if (filters.availability === "Available Today") {
        return text.includes("today");
      }
      if (filters.availability === "Available This Week") {
        return (
          text.includes("today") ||
          text.includes("tomorrow") ||
          ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].some((day) =>
            text.includes(day)
          )
        );
      }
      return true;
    };

    return psychologists.filter((psychologist) => {
      const matchesSearch = !query
        || psychologist.name.toLowerCase().includes(query)
        || psychologist.specializations.some((spec) => spec.toLowerCase().includes(query))
        || psychologist.hospital.toLowerCase().includes(query)
        || psychologist.location.toLowerCase().includes(query)
        || psychologist.languages.some((lang) => lang.toLowerCase().includes(query))
        || (psychologist.bio ?? "").toLowerCase().includes(query);

      const matchesSpecialization =
        filters.specializations.length === 0
        || psychologist.specializations.some((spec) => filters.specializations.includes(spec));

      const matchesHospital =
        filters.hospitals.length === 0 || filters.hospitals.includes(psychologist.hospital);

      const matchesCity =
        filters.city === "All Cities" || psychologist.location === filters.city;

      const matchesRating =
        filters.rating === null || psychologist.rating >= filters.rating;

      const matchesPrice =
        psychologist.price >= filters.priceRange.min && psychologist.price <= filters.priceRange.max;

      const matchesLanguage =
        filters.languages.length === 0
        || psychologist.languages.some((lang) => filters.languages.includes(lang));

      const matchesAvailable = matchesAvailability(psychologist.nextAvailable);

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesHospital &&
        matchesCity &&
        matchesRating &&
        matchesPrice &&
        matchesLanguage &&
        matchesAvailable
      );
    });
  }, [filters, searchQuery]);

  const sortedPsychologists = useMemo(() => {
    const items = [...filteredPsychologists];
    const availabilityRank = (value: string) => {
      const text = value.toLowerCase();
      if (text.includes("today")) return 0;
      if (text.includes("tomorrow")) return 1;
      if (["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].some((day) => text.includes(day))) {
        return 2;
      }
      return 3;
    };

    switch (sortBy) {
      case "Most Reviews":
        return items.sort((a, b) => b.reviewCount - a.reviewCount);
      case "Soonest Available":
        return items.sort((a, b) => availabilityRank(a.nextAvailable) - availabilityRank(b.nextAvailable));
      case "Price: Low to High":
        return items.sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return items.sort((a, b) => b.price - a.price);
      case "Years of Experience":
        return items.sort((a, b) => b.experience - a.experience);
      case "Highest Rated":
      default:
        return items.sort((a, b) => b.rating - a.rating);
    }
  }, [filteredPsychologists, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedPsychologists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPsychologists = sortedPsychologists.slice(startIndex, startIndex + itemsPerPage);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="text-sm text-text-secondary mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground">Find Psychologists</span>
          </nav>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Find a psychologist who fits you
          </h1>
          <p className="text-lg text-text-secondary">
            Browse licensed therapists and book a session that feels right
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            placeholder="Search by name, specialty, or concern..."
            onSearch={setSearchQuery}
          />
        </div>

        {/* Main Content: Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar onFilterChange={setFilters} />
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              {/* Results Count */}
              <div className="text-foreground font-medium">
                Showing {currentPsychologists.length} of {sortedPsychologists.length} psychologists
              </div>

              {/* View Toggle & Sort */}
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "grid"
                        ? "bg-primary text-black"
                        : "text-text-secondary hover:text-foreground"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "list"
                        ? "bg-primary text-black"
                        : "text-text-secondary hover:text-foreground"
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      Sort by: {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Psychologist Cards Grid/List */}
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8" 
                : "flex flex-col gap-4 mb-8"
            }>
              {currentPsychologists.map((psychologist) => (
                <PsychologistCard key={psychologist.id} psychologist={psychologist} />
              ))}
            </div>
            {sortedPsychologists.length === 0 && (
              <div className="mb-8 rounded-xl border border-border bg-card p-6 text-sm text-text-secondary">
                No psychologists match your filters. Try removing one or two filters.
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3"
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-primary text-black" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
