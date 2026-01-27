"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FeatureItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

interface FeaturesAccordionProps {
  features?: FeatureItem[];
}

const defaultFeatures: FeatureItem[] = [
  {
    id: 1,
    title: "Secure video sessions",
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=600&fit=crop",
    description:
      "Meet with licensed psychologists by secure video. Your sessions are private, encrypted, and easy to join from home.",
  },
  {
    id: 2,
    title: "Licensed therapists",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    description:
      "Every therapist is licensed and verified. You get trusted care with real clinical experience.",
  },
  {
    id: 3,
    title: "Flexible Scheduling",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=600&fit=crop",
    description:
      "Book times that work for you, including evenings and weekends. Many therapists have openings within days.",
  },
  {
    id: 4,
    title: "Many specialties",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop",
    description:
      "Find help for anxiety, depression, trauma, relationships, and more. Choose a specialist who fits your needs.",
  },
  {
    id: 5,
    title: "Proven methods",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop",
    description:
      "Therapy is grounded in proven methods like CBT, EMDR, and mindfulness. Care is tailored to you.",
  },
];

export default function FeaturesAccordion({ features = defaultFeatures }: FeaturesAccordionProps) {
  const [activeTabId, setActiveTabId] = useState<number | null>(1);
  const [activeImage, setActiveImage] = useState(features[0].image);

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose HealTalk?
          </h2>
          <p className="text-lg text-text-secondary">
            Professional care built around your needs, with clear steps and kind support.
          </p>
        </div>

        {/* Accordion + Image Section */}
        <div className="flex w-full items-start justify-between gap-8 lg:gap-12">
          <div className="w-full md:w-1/2">
            <Accordion type="single" className="w-full" defaultValue="item-1">
              {features.map((tab) => (
                <AccordionItem key={tab.id} value={`item-${tab.id}`}>
                  <AccordionTrigger
                    onClick={() => {
                      setActiveImage(tab.image);
                      setActiveTabId(tab.id);
                    }}
                    className="cursor-pointer py-5 !no-underline transition hover:no-underline"
                  >
                    <h3
                      className={`text-lg md:text-xl font-semibold text-left transition-colors ${
                        tab.id === activeTabId ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {tab.title}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mt-2 text-text-secondary leading-relaxed">
                      {tab.description}
                    </p>
                    {/* Mobile Image */}
                    <div className="mt-6 md:hidden">
                      <img
                        src={tab.image}
                        alt={tab.title}
                        className="h-full max-h-80 w-full rounded-lg object-cover shadow-md"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Desktop Image */}
          <div className="relative m-auto hidden w-1/2 overflow-hidden rounded-xl md:block">
            <img
              src={activeImage}
              alt="Feature preview"
              className="aspect-[4/3] w-full rounded-xl object-cover shadow-lg transition-all duration-500"
              style={{ objectPosition: 'center' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
