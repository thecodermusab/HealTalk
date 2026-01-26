"use client";

import { Video, Clock, Lock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Video,
    title: "Video Consultations",
    description: "Face-to-face sessions from the comfort of your home",
  },
  {
    icon: Clock,
    title: "No Waiting Times",
    description: "Book appointments instantly with available psychologists",
  },
  {
    icon: Lock,
    title: "100% Confidential",
    description: "Secure and private sessions with end-to-end encryption",
  },
  {
    icon: DollarSign,
    title: "Affordable Care",
    description: "Transparent pricing with no hidden fees",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Choose HealTalk?
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-xl p-10"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="text-primary" size={32} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
