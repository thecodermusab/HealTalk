import ProfileHero from "@/components/profile/ProfileHero";
import AboutSection from "@/components/profile/AboutSection";
import EducationSection from "@/components/profile/EducationSection";
import ReviewsSection from "@/components/profile/ReviewsSection";
import BookingWidget from "@/components/profile/BookingWidget";
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

async function getPsychologistData(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/psychologists/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    // Transform API data to match component expectations
    return {
      psychologist: {
        id: parseInt(id), // Keep as number for component compatibility
        name: data.user.name,
        specialty: data.specializations[0] || 'Clinical Psychologist',
        experience: data.experience,
        rating: data.rating,
        reviewCount: data.reviewCount,
        price: (data.price60 / 100), // Convert cents to dollars
        location: data.hospital?.location || 'Remote',
        image: data.user.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
        about: data.bio,
        specializations: data.specializations,
        education: [
          { degree: 'PhD in Clinical Psychology', school: 'University', year: '2005' }
        ],
        certifications: [
          `License: ${data.licenseNumber}`
        ],
      },
      reviews: data.reviews.map((review: any) => ({
        id: review.id,
        psychologistId: parseInt(id),
        patientName: review.patient.user.name,
        patientImage: review.patient.user.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300',
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.createdAt).toLocaleDateString(),
      })) || [],
    };
  } catch (error) {
    console.error('Error fetching psychologist:', error);
    return null;
  }
}

export default async function PsychologistProfilePage({ params }: PageProps) {
  const { id } = await params;
  const data = await getPsychologistData(id);

  if (!data) {
    notFound();
  }

  const { psychologist, reviews: psychologistReviews } = data;

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
