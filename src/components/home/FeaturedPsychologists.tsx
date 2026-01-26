"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { psychologists } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

export default function FeaturedPsychologists() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(3);

  // Handle responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3);
      } else if (window.innerWidth >= 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % psychologists.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % psychologists.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + psychologists.length) % psychologists.length);
    setIsAutoPlaying(false);
  };

  return (
    <section
      className="py-24 bg-background"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Meet Our Licensed Psychologists
          </h2>
          <p className="text-lg text-text-secondary">
            Experienced professionals ready to support you
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)` }}
            >
              {psychologists.map((psychologist) => (
                <div
                  key={psychologist.id}
                  className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col items-center text-center"
                  >
                    {/* Photo */}
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-6 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full bg-primary/30 flex items-center justify-center text-6xl font-bold text-primary">
                        {psychologist.name.split(' ')[1][0]}
                      </div>
                    </div>

                    {/* Name & Credentials */}
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {psychologist.name}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4">
                      {psychologist.credentials}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="text-yellow-400 fill-yellow-400" size={18} />
                      <span className="font-semibold">{psychologist.rating}</span>
                      <span className="text-text-secondary text-sm">
                        ({psychologist.reviewCount} reviews)
                      </span>
                    </div>

                    {/* Specialization Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {psychologist.specializations.slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Hospital Badge */}
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                      <MapPin size={16} className="text-primary" />
                      <span>{psychologist.hospital}, {psychologist.location}</span>
                    </div>

                    {/* Languages */}
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
                      <Languages size={16} className="text-primary" />
                      <span>{psychologist.languages.join(", ")}</span>
                    </div>

                    {/* View Profile Button */}
                    <Link href={`/psychologist/${psychologist.id}`} className="w-full mt-auto">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        View Profile
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {psychologists.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-8" : "bg-border"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
