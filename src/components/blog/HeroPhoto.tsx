import React from "react";
import Image from "next/image";
import { BlogPost } from "@/lib/mock-blog-data";

interface HeroPhotoProps {
  post: BlogPost;
}

export function HeroPhoto({ post }: HeroPhotoProps) {
  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
      {/* Intro Text */}
      <div className="max-w-4xl mb-12">
        <h1 className="text-4xl md:text-6xl lg:text-[72px] font-display font-medium leading-[1.05] tracking-tight text-[#1a1a1a] mb-6">
            {post.title}
        </h1>
        <p className="text-lg md:text-xl leading-relaxed max-w-2xl text-[#1a1a1a]">
            {post.subtitle}
        </p>
      </div>

      {/* Hero Card - Dark Green Backdrop */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[24px] overflow-hidden shadow-md">
             {post.imageUrl ? (
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
             ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white/50">No Image</div>
             )}
      </div>
    </div>
  );
}
