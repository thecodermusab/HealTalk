import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/mock-blog-data";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/resources/blog/${post.id}`} className="group block h-full">
      <div className="flex flex-col gap-4 h-full">
        {/* Card Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[3/2] overflow-hidden rounded-[16px] bg-gray-100">
             <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
             />
        </div>

        {/* Card Content - Clean whitespace, no borders */}
        <div className="flex flex-col gap-2">
            <h3 className="text-xl md:text-2xl font-bold font-sans text-gray-900 leading-tight group-hover:text-gray-600 transition-colors">
                {post.title}
            </h3>
            <p className="text-sm md:text-base text-gray-500 line-clamp-3 leading-relaxed">
                {post.excerpt}
            </p>
        </div>
      </div>
    </Link>
  );

}
