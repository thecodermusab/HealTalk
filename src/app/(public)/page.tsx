import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";

// Lazy load components that are below the fold
const FeaturesAccordion = dynamic(() => import("@/components/home/FeaturesAccordion"), {
  loading: () => <div className="h-96" />
});
const FeaturedPsychologists = dynamic(() => import("@/components/home/FeaturedPsychologists"), {
  loading: () => <div className="h-96" />
});
const WhyChoosePsyConnect = dynamic(() => import("@/components/home/WhyChoosePsyConnect"), {
  loading: () => <div className="h-96" />
});
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  loading: () => <div className="h-96" />
});

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesAccordion />
      <Testimonials />
      <FeaturedPsychologists />
      <WhyChoosePsyConnect />
    </main>
  );
}
