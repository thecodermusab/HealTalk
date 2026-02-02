import React from "react";
import Link from "next/link";
import { PodcastEpisode } from "@/lib/types";
import { Play, Youtube } from "lucide-react"; // Using Lucide icons for now

interface PodcastCardProps {
  episode: PodcastEpisode;
}

export function PodcastCard({ episode }: PodcastCardProps) {
  return (
    <div className="group flex flex-col gap-5 bg-[#FBF9F6] p-4 rounded-[18px] w-full md:w-[450px] h-auto md:h-[600px]">
      {/* Cover Block - Fixed dimensions 383x396 as requested */}
      <div className="relative w-full md:w-[383px] aspect-square md:aspect-auto md:h-[396px] bg-[#FFD6F7] rounded-[16px] flex flex-col items-center justify-between py-6 overflow-hidden shrink-0 mx-auto">
         {/* Top Text */}
         <span className="font-display text-2xl text-[#1a1a1a]">The Ramp</span>
         
         {/* Center Illustration (Abstract Stairs/Hand) */}
         <div className="w-32 h-32 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-white stroke-black stroke-[1.5px]">
                {/* Abstract Stairs shape */}
                <path d="M20 80 L80 80 L80 60 L60 60 L60 40 L40 40 L40 20 L20 20 Z" />
                {/* Sparkle */}
                <path d="M70 30 L72 25 L77 25 L73 21 L75 16 L70 19 L65 16 L67 21 L63 25 L68 25 Z" fill="#F0FF80" />
            </svg>
         </div>

         {/* Bottom Text */}
         <span className="font-display text-sm text-[#1a1a1a]">Amby</span>
      </div>

      {/* Info Block */}
      <div className="flex flex-col gap-3 px-1 flex-grow">
        {/* Episode Number */}
        <div className="w-fit border border-[#1a1a1a]/20 px-2 py-[2px] rounded-sm">
             <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a]">{episode.episodeNumber}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#1a1a1a] leading-tight line-clamp-2">
            {episode.title}
        </h3>

        {/* Links (pushed to bottom) */}
        <div className="flex items-center gap-4 mt-auto pt-2">
            <Link href={episode.spotifyUrl} className="flex items-center gap-1.5 group/link">
                <div className="w-6 h-6 rounded-full bg-[#1DB954] flex items-center justify-center text-black">
                    <Play size={10} fill="currentColor" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wide text-[#1a1a1a] group-hover/link:underline">Spotify</span>
            </Link>

            <Link href={episode.youtubeUrl} className="flex items-center gap-1.5 group/link">
                <div className="w-6 h-6 rounded-full bg-[#FF0000] flex items-center justify-center text-white">
                    <Youtube size={12} fill="currentColor" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wide text-[#1a1a1a] group-hover/link:underline">Youtube</span>
            </Link>
        </div>
      </div>
    </div>
  );
}
