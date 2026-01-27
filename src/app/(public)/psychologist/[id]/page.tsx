import ProfileHero from "@/components/profile/ProfileHero";
import AboutSection from "@/components/profile/AboutSection";
import EducationSection from "@/components/profile/EducationSection";
import ReviewsSection from "@/components/profile/ReviewsSection";
import BookingWidget from "@/components/profile/BookingWidget";
import { psychologists, reviews } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Psychologist Profile | HealTalk",
  description: "View therapist details, specialties, and book a session.",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PsychologistProfilePage({ params }: PageProps) {
  const { id } = await params;
  const psychologist = psychologists.find(p => p.id === parseInt(id));

  if (!psychologist) {
    notFound();
  }

  const psychologistReviews = reviews.filter(r => r.psychologistId === psychologist.id);

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Banner */}
      <ProfileHero psychologist={psychologist} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <AboutSection psychologist={psychologist} />
            <EducationSection psychologist={psychologist} />
            <ReviewsSection
              psychologistId={psychologist.id}
              rating={psychologist.rating}
              reviewCount={psychologist.reviewCount}
              reviews={psychologistReviews}
            />
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <BookingWidget price={psychologist.price} />
          </div>
        </div>
      </div>
    </main>
  );
}
