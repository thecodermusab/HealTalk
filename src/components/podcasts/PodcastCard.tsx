"use client";

import React from "react";
import Link from "next/link";
import { PodcastEpisode } from "@/lib/types";
import { Play, Youtube } from "lucide-react";

interface PodcastCardProps {
  episode: PodcastEpisode;
}

export function PodcastCard({ episode }: PodcastCardProps) {
  return (
    <div className="group flex flex-col gap-5 bg-[#FBF9F6] p-4 rounded-[18px] w-full md:w-[450px] h-auto md:h-[600px]">
      {/* Cover Block */}
      <div className="relative w-full md:w-[383px] aspect-square md:aspect-auto md:h-[396px] bg-[#d5f0c0] rounded-[16px] flex flex-col items-center justify-between py-6 overflow-hidden shrink-0 mx-auto">
        {/* Top Text */}
        <span className="font-display text-2xl text-[#1a1a1a]">HealTalk</span>

        {/* Center Illustration — simple mind/heart icon */}
        <div className="w-28 h-28 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Brain outline — simplified two-lobe shape */}
            <ellipse cx="38" cy="52" rx="18" ry="22" fill="white" stroke="#1a1a1a" strokeWidth="2.5"/>
            <ellipse cx="62" cy="52" rx="18" ry="22" fill="white" stroke="#1a1a1a" strokeWidth="2.5"/>
            <rect x="44" y="30" width="12" height="44" fill="#d5f0c0"/>
            <line x1="50" y1="30" x2="50" y2="74" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Sparkle */}
            <circle cx="72" cy="28" r="4" fill="#408954"/>
            <circle cx="28" cy="30" r="2.5" fill="#408954"/>
          </svg>
        </div>

        {/* Bottom Text */}
        <span className="font-display text-sm text-[#1a1a1a]">Wellness</span>
      </div>

      {/* Info Block */}
      <div className="flex flex-col gap-3 px-1 flex-grow">
        {/* Episode Number + Host */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="border border-[#1a1a1a]/20 px-2 py-[2px] rounded-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a]">
              Ep. {episode.episodeNumber}
            </span>
          </div>
          {episode.host && (
            <span className="text-[11px] text-[#555] font-medium">{episode.host}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#1a1a1a] leading-tight line-clamp-2">
          {episode.title}
        </h3>

        {/* Description */}
        {episode.description && (
          <p className="text-[13px] text-[#555] leading-snug line-clamp-3">
            {episode.description}
          </p>
        )}

        {/* Links */}
        <div className="flex items-center gap-4 mt-auto pt-2">
          <Link
            href={episode.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 group/link"
          >
            <div className="w-6 h-6 rounded-full bg-[#1DB954] flex items-center justify-center text-black">
              <Play size={10} fill="currentColor" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#1a1a1a] group-hover/link:underline">
              Spotify
            </span>
          </Link>

          <Link
            href={episode.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 group/link"
          >
            <div className="w-6 h-6 rounded-full bg-[#FF0000] flex items-center justify-center text-white">
              <Youtube size={12} fill="currentColor" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#1a1a1a] group-hover/link:underline">
              YouTube
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
