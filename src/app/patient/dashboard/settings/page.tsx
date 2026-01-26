import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { User, Bell, Lock, CreditCard, Globe, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-text-secondary">Manage your account and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Full Name
                </label>
                <Input defaultValue="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email
                </label>
                <Input type="email" defaultValue="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Phone
                </label>
                <Input type="tel" defaultValue="+90 555 123 4567" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Date of Birth
                </label>
                <Input type="date" defaultValue="1990-01-15" />
              </div>
            </div>
            <Button className="mt-4 bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </div>

          {/* Security */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Lock className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Security</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Current Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  New Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Confirm New Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button className="mt-4 bg-primary hover:bg-primary/90">
              Update Password
            </Button>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Appointment reminders", defaultChecked: true },
                { label: "New messages", defaultChecked: true },
                { label: "Promotional emails", defaultChecked: false },
                { label: "SMS notifications", defaultChecked: true },
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

          {/* Privacy */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Eye className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Privacy</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Show profile to other patients", defaultChecked: false },
                { label: "Allow psychologists to contact me", defaultChecked: true },
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

          {/* Danger Zone */}
          <div className="bg-white border border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
            <p className="text-text-secondary mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
