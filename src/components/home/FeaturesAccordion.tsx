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
    title: "Secure Video Consultations",
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=600&fit=crop",
    description:
      "Connect with licensed psychologists through our HIPAA-compliant video platform. Experience face-to-face therapy from the comfort of your home with end-to-end encryption ensuring your privacy and confidentiality at all times.",
  },
  {
    id: 2,
    title: "Licensed & Experienced Professionals",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    description:
      "All our psychologists are licensed professionals with verified credentials and extensive experience. Each specialist is carefully vetted and partnered with leading hospitals, ensuring you receive the highest quality mental health care.",
  },
  {
    id: 3,
    title: "Flexible Scheduling",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=600&fit=crop",
    description:
      "Book appointments that fit your schedule. With availability from morning to evening, including weekends, you can find a time that works for you. No more waiting weeks for an appointment - many psychologists offer same-day or next-day sessions.",
  },
  {
    id: 4,
    title: "Comprehensive Specializations",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop",
    description:
      "Whether you're dealing with anxiety, depression, trauma, relationship issues, or any other mental health concern, our diverse team of specialists can help. We offer expertise in child psychology, family therapy, addiction counseling, and more.",
  },
  {
    id: 5,
    title: "Evidence-Based Approaches",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop",
    description:
      "Our psychologists use proven therapeutic methods including Cognitive Behavioral Therapy (CBT), EMDR, psychodynamic therapy, and mindfulness-based approaches. Receive treatment backed by scientific research and tailored to your unique needs.",
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
            Why Choose PsyConnect?
          </h2>
          <p className="text-lg text-text-secondary">
            Professional mental health support designed around your needs, delivered with care and expertise.
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
