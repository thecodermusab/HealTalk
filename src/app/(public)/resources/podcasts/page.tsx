import React from "react";
import { PodcastsHero } from "@/components/podcasts/PodcastsHero";
import { PodcastGrid } from "@/components/podcasts/PodcastGrid";
import { PODCAST_EPISODES } from "@/lib/mock-podcast-data";
export default function PodcastsPage() {
  return (
    <div className="min-h-screen bg-[#F6F1EA] flex flex-col">
      
      <main className="flex-grow">
        <PodcastsHero />
        <PodcastGrid initialEpisodes={PODCAST_EPISODES} />
      </main>
    </div>
  );
}
