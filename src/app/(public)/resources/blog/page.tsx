import React from "react";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BLOG_POSTS } from "@/lib/mock-blog-data";
export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F6F1EA] flex flex-col">
      
      <main className="flex-grow">
        <BlogHero />
        <BlogGrid initialPosts={BLOG_POSTS} />
      </main>
    </div>
  );
}
