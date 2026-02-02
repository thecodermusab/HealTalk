import React from "react";
import { notFound } from "next/navigation";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { AuthorBand } from "@/components/blog/AuthorBand";

// Reuse the blog layout for now as it's clean and "Amby" style
// We'll create a simple "Download / Content" view for the guide

interface PageProps {
  params: {
    slug: string;
  };
}

async function getGuides() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/guides`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.guides || [];
  } catch (error) {
    console.error('Failed to fetch guides:', error);
    return [];
  }
}

export default async function GuideDetailPage({ params }: PageProps) {
  const guides = await getGuides();
  const guide = guides.find((g: any) => {
      // Handle both full href matching or just slug matching
      const slugFromHref = g.href.split("/").filter(Boolean).pop();
      return slugFromHref === params.slug;
  });

  if (!guide) {
    notFound();
  }

  return (
    <BlogPostLayout>
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
         {/* Simple Guide Header */}
         <div className="max-w-4xl mb-12">
            <div className="w-fit border border-[#1a1a1a]/20 px-3 py-1 rounded-full mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">GUIDE</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-medium leading-[1.05] tracking-tight text-[#1a1a1a] mb-6">
                {guide.title}
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl text-[#1a1a1a]/80">
                This is a placeholder for the guide content. In a real application, this would contain the form to download "{guide.title}" or the full HTML content.
            </p>
         </div>

         {/* Placeholder Content Area */}
         <div className="w-full h-96 bg-gray-100 rounded-[32px] flex items-center justify-center border border-dashed border-gray-300">
             <div className="text-center p-8">
                 <p className="font-display text-2xl mb-4 text-[#1a1a1a]">Content Locked</p>
                 <p className="text-[#1a1a1a]/60">Please contact Amby to access this resource.</p>
             </div>
         </div>
      </div>
      
       {/* Generic Author Band */}
      <AuthorBand author={{
          name: "Amby Team",
          role: "Resources",
          bio: "Curated guides and reports from the Amby team.",
          imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
          linkedinUrl: "#"
      }} />
    </BlogPostLayout>
  );
}
