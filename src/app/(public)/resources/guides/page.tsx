import React from "react";
import { GuidesHero } from "@/components/guides/GuidesHero";
import { GuidesGrid } from "@/components/guides/GuidesGrid";
import { GUIDES } from "@/lib/mock-guides-data";
export default async function GuidesPage() {
  console.log("Rendering GuidesPage");
  return (
    <div className="min-h-screen bg-[#F6F1EA] flex flex-col">
      <main className="flex-grow">
        <GuidesHero />
        <GuidesGrid initialGuides={GUIDES} />
      </main>
    </div>
  );
}
