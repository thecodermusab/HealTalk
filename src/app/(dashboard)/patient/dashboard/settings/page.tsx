"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Bell, Shield, Save, Eye, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
          <p className="text-text-secondary">Manage your account preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
           {/* Sidebar Tabs */}
           <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
              <button 
                onClick={() => setActiveTab("profile")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                  activeTab === "profile" ? "bg-white text-[#5B6CFF] shadow-sm border border-[#E6EAF2]" : "text-gray-500 hover:bg-white/50"
                )}
              >
                <User size={18} /> Profile Details
              </button>
              <button 
                onClick={() => setActiveTab("notifications")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                  activeTab === "notifications" ? "bg-white text-[#5B6CFF] shadow-sm border border-[#E6EAF2]" : "text-gray-500 hover:bg-white/50"
                )}
              >
                <Bell size={18} /> Notifications
              </button>
              <button 
                onClick={() => setActiveTab("security")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                  activeTab === "security" ? "bg-white text-[#5B6CFF] shadow-sm border border-[#E6EAF2]" : "text-gray-500 hover:bg-white/50"
                )}
              >
                <Shield size={18} /> Security & Auth
              </button>
              <button 
                onClick={() => setActiveTab("privacy")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                  activeTab === "privacy" ? "bg-white text-[#5B6CFF] shadow-sm border border-[#E6EAF2]" : "text-gray-500 hover:bg-white/50"
                )}
              >
                <Eye size={18} /> Privacy
              </button>
           </div>

           {/* Content Area */}
           <div className="flex-1 w-full bg-white rounded-[16px] border border-[#E6EAF2] shadow-sm px-6 pt-1 pb-6 -mt-10 lg:mt-0">
              
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   
                   <div className="flex items-center gap-6 py-4 border-b border-gray-100 mt-8">
                      <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                         <img src="/images/Me.png" alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="flex gap-3">
                            <Button size="sm" variant="outline" className="text-xs">Change Photo</Button>
                            <Button size="sm" variant="ghost" className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50">Remove</Button>
                         </div>
                         <p className="text-xs text-gray-400">JPG, GIF or PNG. 1MB Max.</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">First Name</label>
                         <Input defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">Last Name</label>
                         <Input defaultValue="Doe" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">Email Address</label>
                         <Input defaultValue="john.doe@example.com" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">Phone Number</label>
                         <Input defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                         <Input type="date" defaultValue="1990-01-15" />
                      </div>
                   </div>

                   <div className="pt-4 flex justify-end">
                      <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0]">Save Changes</Button>
                   </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "notifications" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                   <div className="space-y-4 mt-8">
                      <div className="flex items-center justify-between p-4 border border-[#E6EAF2] rounded-xl">
                         <div>
                            <h4 className="font-medium text-gray-900">Email Notifications</h4>
                            <p className="text-xs text-gray-500">Receive emails about your account activity.</p>
                         </div>
                         <div className="h-6 w-11 bg-[#5B6CFF] rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-[#E6EAF2] rounded-xl">
                         <div>
                            <h4 className="font-medium text-gray-900">Appointment Reminders</h4>
                            <p className="text-xs text-gray-500">Get notified 1 hour before sessions start.</p>
                         </div>
                         <div className="h-6 w-11 bg-[#5B6CFF] rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                         </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-[#E6EAF2] rounded-xl">
                         <div>
                            <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                            <p className="text-xs text-gray-500">Receive alerts via text message.</p>
                         </div>
                         <div className="h-6 w-11 bg-[#5B6CFF] rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                         </div>
                      </div>
                   </div>
                   
                   <div className="pt-4 flex justify-end">
                      <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0]">Save Preferences</Button>
                   </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                   <div className="space-y-4 mt-8">
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">Current Password</label>
                         <Input type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">New Password</label>
                         <Input type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                         <Input type="password" placeholder="••••••••" />
                      </div>
                   </div>

                   {/* Danger Zone */}
                   <div className="mt-8 pt-6 border-t border-red-100">
                      <h4 className="text-red-600 font-bold mb-2 flex items-center gap-2">
                        <AlertTriangle size={18} /> Danger Zone
                      </h4>
                      <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
                         <div>
                            <p className="text-sm font-medium text-gray-900">Delete Account</p>
                            <p className="text-xs text-gray-500">Once deleted, your data cannot be recovered.</p>
                         </div>
                         <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700">Delete</Button>
                      </div>
                   </div>
                   
                   <div className="pt-4 flex justify-end">
                      <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0] gap-2">
                        <Save size={16} /> Update Password
                      </Button>
                   </div>
                </div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === "privacy" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                   <div className="space-y-4 mt-8">
                      <div className="flex items-center justify-between p-4 border border-[#E6EAF2] rounded-xl">
                         <div>
                            <h4 className="font-medium text-gray-900">Public Profile</h4>
                            <p className="text-xs text-gray-500">Allow other patients to see your basic profile.</p>
                         </div>
                         <div className="h-6 w-11 bg-gray-200 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-[#E6EAF2] rounded-xl">
                         <div>
                            <h4 className="font-medium text-gray-900">Contact from Psychologists</h4>
                            <p className="text-xs text-gray-500">Allow psychologists to send you connection requests.</p>
                         </div>
                         <div className="h-6 w-11 bg-[#5B6CFF] rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                         </div>
                      </div>
                   </div>
                   
                   <div className="pt-4 flex justify-end">
                      <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0]">Save Privacy Settings</Button>
                   </div>
                </div>
              )}

           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
