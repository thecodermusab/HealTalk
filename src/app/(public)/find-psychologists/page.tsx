"use client";

import { useState } from "react";
import SearchBar from "@/components/psychologists/SearchBar";
import FilterSidebar from "@/components/psychologists/FilterSidebar";
import PsychologistCard from "@/components/psychologists/PsychologistCard";
import { psychologists } from "@/lib/data";
import { Grid3x3, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FindPsychologistsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("Highest Rated");
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

  // Pagination
  const totalPages = Math.ceil(psychologists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPsychologists = psychologists.slice(startIndex, startIndex + itemsPerPage);

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="text-sm text-text-secondary mb-4">
            <a href="/" className="hover:text-primary">Home</a>
            <span className="mx-2">›</span>
            <span className="text-foreground">Find Psychologists</span>
          </nav>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Find Your Perfect Psychologist
          </h1>
          <p className="text-lg text-text-secondary">
            Browse our licensed professionals and book your first appointment
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Main Content: Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar />
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              {/* Results Count */}
              <div className="text-foreground font-medium">
                Showing {currentPsychologists.length} of {psychologists.length} psychologists
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
