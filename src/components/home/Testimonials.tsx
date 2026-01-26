"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    text: "I was skeptical about online consultations, but Doctorin exceeded my expectations. The doctor was professional, attentive, and provided accurate diagnosis. Highly recommend!",
    name: "Sarah Ahmed",
    role: "Software Engineer",
  },
  {
    id: 2,
    text: "PsyConnect made it easy to get help without the stress of travel. My psychologist listened carefully and the sessions felt personal.",
    name: "Nora Malik",
    role: "Project Manager",
  },
  {
    id: 3,
    text: "The platform is seamless and the care feels premium. I found the right specialist quickly and felt supported every step.",
    name: "Ethan Brooks",
    role: "Product Designer",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = testimonials.length;
  const activeTestimonial = testimonials[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingField = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      if (isTypingField) {
        return;
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + total) % total);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % total);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total]);

  return (
    <section className="py-20 sm:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
            What Our Patients Say
          </h2>
        </div>

        <div className="bg-card rounded-[36px] shadow-lg px-8 sm:px-14 lg:px-20 py-14 sm:py-16 lg:py-20 border border-border">
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Previous testimonial"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-border text-secondary flex items-center justify-center transition-colors hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex-1 text-center max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <p className="text-xl sm:text-2xl leading-relaxed text-text-secondary">
                    {activeTestimonial.text}
                  </p>

                  <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={18}
                        className="text-accent fill-accent"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-accent/15 text-foreground flex items-center justify-center text-sm font-semibold">
                      {activeTestimonial.name.split(" ").slice(0, 1).join("")}
                    </div>
                    <div className="text-left">
                      <div className="text-foreground font-semibold">
                        {activeTestimonial.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {activeTestimonial.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-border text-secondary flex items-center justify-center transition-colors hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
