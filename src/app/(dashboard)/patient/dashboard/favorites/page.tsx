"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FavoritesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Favorite Psychologists
          </h1>
          <p className="text-gray-500">Psychologists you&apos;ve saved for quick access</p>
        </div>

        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-[24px]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Favorites Yet</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            You haven&apos;t saved any psychologists yet. Browse our list to find
            specialists that match your needs.
          </p>
          <Link href="/find-psychologists">
            <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0] gap-2 h-11 px-6">
              Find Psychologists <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
