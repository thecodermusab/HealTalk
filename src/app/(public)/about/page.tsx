import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutLeaders from "@/components/about/AboutLeaders";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20 bg-[#fff7f2]">
       <AboutHero />
       <AboutStory />
       <AboutLeaders />
    </main>
  );
}
