import React from "react";
import { PodcastsHero } from "@/components/podcasts/PodcastsHero";
import { PodcastGrid } from "@/components/podcasts/PodcastGrid";

async function getPodcasts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/podcasts`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.episodes || [];
  } catch (error) {
    console.error('Failed to fetch podcast episodes:', error);
    return [];
  }
}

export default async function PodcastsPage() {
  const episodes = await getPodcasts();

  return (
    <div className="min-h-screen bg-[#F6F1EA] flex flex-col">

      <main className="flex-grow">
        <PodcastsHero />
        <PodcastGrid initialEpisodes={episodes} />
      </main>
    </div>
  );
}
