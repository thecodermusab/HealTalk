import React from "react";
import { GuidesHero } from "@/components/guides/GuidesHero";
import { GuidesGrid } from "@/components/guides/GuidesGrid";

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

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <div className="min-h-screen bg-[#F6F1EA] flex flex-col">
      <main className="flex-grow">
        <GuidesHero />
        <GuidesGrid initialGuides={guides} />
      </main>
    </div>
  );
}
