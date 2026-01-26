"use client";

import { FormEvent, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { User, Bell, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isAvailabilitySaving, setIsAvailabilitySaving] = useState(false);

  const handleProfileUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProfileSaving(true);

    try {
      console.log("Psychologist profile update submitted");
      alert("Profile changes saved (placeholder).");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleAvailabilityUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAvailabilitySaving(true);

    try {
      console.log("Psychologist availability update submitted");
      alert("Availability updated (placeholder).");
    } finally {
      setIsAvailabilitySaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-text-secondary">Manage your professional profile and availability</p>
        </div>

        <div className="space-y-6">
          {/* Professional Info */}
          <form onSubmit={handleProfileUpdate}>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="text-primary" size={20} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Professional Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Full Name
                  </label>
                  <Input defaultValue="Dr. Ahmet Yılmaz" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    License Number
                  </label>
                  <Input defaultValue="PSY-12345-TR" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Credentials
                  </label>
                  <Input defaultValue="PhD, Clinical Psychologist" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Years of Experience
                  </label>
                  <Input type="number" defaultValue="12" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Bio
                  </label>
                  <textarea
                    className="w-full min-h-24 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    defaultValue="Licensed clinical psychologist with over 12 years of experience in treating anxiety disorders, depression, and trauma."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Specializations (comma-separated)
                  </label>
                  <Input defaultValue="Anxiety Disorders, Depression, Trauma & PTSD" />
                </div>
              </div>
              <Button className="mt-4 bg-primary hover:bg-primary/90" type="submit" disabled={isProfileSaving}>
                {isProfileSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* Pricing */}
            <div className="bg-card border border-border rounded-xl p-6 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-primary" size={20} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Pricing</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Session Price (60 min)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">₺</span>
                    <Input type="number" defaultValue="450" className="pl-8" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Extended Session (90 min)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">₺</span>
                    <Input type="number" defaultValue="650" className="pl-8" />
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Availability */}
          <form className="bg-card border border-border rounded-xl p-6" onSubmit={handleAvailabilityUpdate}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Availability</h2>
            </div>
            <div className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <label className="flex items-center gap-2 w-32">
                    <input
                      type="checkbox"
                      defaultChecked={day !== "Sunday"}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-foreground">{day}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-1">
                    <Input type="time" defaultValue="09:00" className="max-w-32" />
                    <span className="text-text-secondary">to</span>
                    <Input type="time" defaultValue="17:00" className="max-w-32" />
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4 bg-primary hover:bg-primary/90" type="submit" disabled={isAvailabilitySaving}>
              {isAvailabilitySaving ? "Updating..." : "Update Availability"}
            </Button>
          </form>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "New appointment bookings", defaultChecked: true },
                { label: "Appointment reminders (30 min before)", defaultChecked: true },
                { label: "New patient messages", defaultChecked: true },
                { label: "Payment notifications", defaultChecked: true },
                { label: "Marketing emails", defaultChecked: false },
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.defaultChecked}
                    className="w-5 h-5 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-foreground">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
