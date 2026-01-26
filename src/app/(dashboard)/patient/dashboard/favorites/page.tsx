import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Heart, Star, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FavoritesPage() {
  const favoritePsychologists = [
    {
      id: 1,
      name: "Dr. Ahmet Yılmaz",
      credentials: "PhD, Clinical Psychologist",
      rating: 4.8,
      reviewCount: 120,
      specializations: ["Anxiety Disorders", "Depression"],
      hospital: "Acıbadem Hospital",
      location: "Istanbul",
      price: 450,
    },
    {
      id: 2,
      name: "Dr. Ayşe Demir",
      credentials: "PhD, Clinical Psychologist",
      rating: 4.9,
      reviewCount: 89,
      specializations: ["Trauma & PTSD", "Family Therapy"],
      hospital: "Memorial Hospital",
      location: "Istanbul",
      price: 500,
    },
  ];

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Favorite Psychologists</h1>
          <p className="text-text-secondary">
            Psychologists you've saved for quick access
          </p>
        </div>

        {/* Favorites Grid */}
        {favoritePsychologists.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {favoritePsychologists.map((psychologist) => (
              <div
                key={psychologist.id}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                {/* Photo & Remove Button */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">
                      {psychologist.name.split(" ")[1][0]}
                    </span>
                  </div>
                  <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <Heart size={24} fill="currentColor" />
                  </button>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {psychologist.name}
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  {psychologist.credentials}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <Star className="text-accent fill-accent" size={16} />
                  <span className="font-semibold text-sm">{psychologist.rating}</span>
                  <span className="text-text-secondary text-sm">
                    ({psychologist.reviewCount} reviews)
                  </span>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {psychologist.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                  <MapPin size={16} className="text-primary" />
                  <span>{psychologist.hospital}, {psychologist.location}</span>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-lg font-bold text-foreground">
                    ₺{psychologist.price}
                    <span className="text-sm font-normal text-text-secondary">/session</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/psychologist/${psychologist.id}`}>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/psychologist/${psychologist.id}?book=true`}>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Calendar className="mr-1" size={16} />
                        Book
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <Heart className="mx-auto mb-4 text-text-secondary" size={64} />
            <h3 className="text-xl font-bold text-foreground mb-2">
              No Favorites Yet
            </h3>
            <p className="text-text-secondary mb-6">
              Save psychologists you like for quick access
            </p>
            <Link href="/find-psychologists">
              <Button className="bg-primary hover:bg-primary/90">
                Find Psychologists
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
