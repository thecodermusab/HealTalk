"use client";

import Link from "next/link";
import { psychologists } from "@/lib/data";
import { Star, MapPin } from "lucide-react";

// Professional psychologist images from Unsplash
const psychologistImages = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=1200&fit=crop", // Professional male doctor
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&h=1200&fit=crop", // Professional female doctor
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&h=1200&fit=crop", // Professional male therapist
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=1200&fit=crop", // Professional female therapist
];

export default function FeaturedPsychologists() {
  return (
    <section className="bg-background py-16 md:py-32">
      <div className="mx-auto max-w-7xl border-t border-border px-6">
        <span className="text-caption -ml-6 -mt-3.5 block w-max bg-background px-6">
          Our Therapists
        </span>

        <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
          <div className="sm:w-2/5">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Meet our licensed psychologists
            </h2>
          </div>
          <div className="mt-6 sm:mt-0">
            <p className="text-muted-foreground">
              Each therapist offers warm, evidence-based care. Find someone who
              understands your needs and helps you feel better over time.
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-24">
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {psychologists.map((psychologist, index) => (
              <Link
                key={psychologist.id}
                href={`/psychologist/${psychologist.id}`}
                className="group overflow-hidden block"
              >
                <img
                  className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
                  src={psychologistImages[index % psychologistImages.length]}
                  alt={psychologist.name}
                  width="826"
                  height="1239"
                  loading="lazy"
                />
                <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                  <div className="flex justify-between">
                    <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                      {psychologist.name}
                    </h3>
                    <span className="text-xs">_0{index + 1}</span>
                  </div>
                  <div className="mt-1 flex flex-col gap-1">
                    <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {psychologist.specializations[0]}
                    </span>
                    <div className="inline-flex items-center gap-2 translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="flex items-center gap-1">
                        <Star className="text-accent fill-accent" size={14} />
                        <span className="text-sm font-medium">{psychologist.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-primary" />
                        <span className="text-xs text-muted-foreground">{psychologist.location}</span>
                      </div>
                    </div>
                    <span className="text-primary inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100">
                      View profile →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center md:mt-16">
          <Link
            href="/find-psychologists"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            Browse all therapists
          </Link>
        </div>
      </div>
    </section>
  );
}
