"use client";

import { UserPlus, Search, Video } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Sign Up",
    description: "Create your profile in minutes. Simple, secure, and confidential.",
    icon: UserPlus,
  },
  {
    number: 2,
    title: "Find Your Psychologist",
    description: "Browse by location, specialty, and availability to find your perfect match.",
    icon: Search,
  },
  {
    number: 3,
    title: "Book & Connect",
    description: "Schedule appointments and start video consultations from anywhere.",
    icon: Video,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Get Started in Three Simple Steps
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Your journey to better mental health begins here
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-white border border-border rounded-xl p-10 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <step.icon className="text-primary group-hover:text-white transition-colors" size={32} />
                </div>

                {/* Step Number */}
                <div className="text-sm font-semibold text-primary mb-2">
                  Step {step.number}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-base text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
