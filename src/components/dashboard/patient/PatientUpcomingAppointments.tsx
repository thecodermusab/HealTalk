"use client";

import { useState } from "react";
import { Video, Phone, MoreVertical, Plus, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";

const dates = Array.from({ length: 14 }, (_, i) => 13 + i); // 13...26

const initialAppointments = [
  {
    id: 1,
    day: 13,
    type: "Individual Session",
    psychologist: "Dr. Ahmet Yılmaz",
    image: "", 
    time: "11:00 am - 11:45 am",
    mode: "video"
  },
  {
    id: 2,
    day: 13,
    type: "Review Session",
    psychologist: "Dr. Ayşe Demir",
    image: "",
    time: "12:00 pm - 12:45 pm",
    mode: "audio"
  },
  {
    id: 3,
    day: 17,
    type: "Individual Session",
    psychologist: "Dr. Ahmet Yılmaz",
    image: "",
    time: "10:00 am - 10:45 am",
    mode: "video"
  },
];

export function PatientUpcomingAppointments() {
  const [selectedDate, setSelectedDate] = useState(13);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filterType, setFilterType] = useState<"all" | "video" | "audio">("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Appointment Form State
  const [psychologistName, setPsychologistName] = useState("");
  const [newApptTime, setNewApptTime] = useState("");
  const [newApptType, setNewApptType] = useState("Individual Session");
  const [newApptMode, setNewApptMode] = useState<"video" | "audio">("video");

  const filteredAppointments = appointments.filter(apt => {
    const dateMatch = apt.day === selectedDate;
    const typeMatch = filterType === "all" ? true : apt.mode === filterType;
    return dateMatch && typeMatch;
  });

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...appointments.map(a => a.id)) + 1;
    const newAppt = {
      id: newId,
      day: selectedDate, // Add to currently selected date
      type: newApptType,
      psychologist: psychologistName,
      image: "", // Placeholder or default
      time: newApptTime,
      mode: newApptMode
    };
    setAppointments([...appointments, newAppt]);
    setIsAddModalOpen(false);
    // Reset form
    setPsychologistName("");
    setNewApptTime("");
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] relative">
      
      {/* BOOK APPOINTMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Book Appointment</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)}>
                  <X size={20} />
                </Button>
             </div>
             
             <form onSubmit={handleBookAppointment} className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="psychologistName">Psychologist Name</Label>
                 <Input 
                   id="psychologistName" 
                   placeholder="e.g. Dr. Ahmet Yılmaz" 
                   value={psychologistName}
                   onChange={(e) => setPsychologistName(e.target.value)}
                   required
                 />
               </div>

               <div className="space-y-2">
                 <Label htmlFor="time">Time</Label>
                 <Input 
                   id="time" 
                   placeholder="e.g. 10:00 am - 11:00 am" 
                   value={newApptTime}
                   onChange={(e) => setNewApptTime(e.target.value)}
                   required
                 />
               </div>

               <div className="space-y-2">
                 <Label>Mode</Label>
                 <div className="flex gap-2">
                   <Button 
                     type="button" 
                     variant={newApptMode === "video" ? "default" : "outline"} 
                     className={cn("flex-1", newApptMode === "video" ? "bg-[#5B6CFF]" : "")}
                     onClick={() => setNewApptMode("video")}
                   >
                     <Video size={16} className="mr-2" /> Video
                   </Button>
                   <Button 
                     type="button" 
                     variant={newApptMode === "audio" ? "default" : "outline"}
                     className={cn("flex-1", newApptMode === "audio" ? "bg-[#FF9F43]" : "")}
                     onClick={() => setNewApptMode("audio")}
                   >
                     <Phone size={16} className="mr-2" /> Audio
                   </Button>
                 </div>
               </div>

               <Button type="submit" className="w-full bg-[#364a60] hover:bg-[#2c3e50] mt-4">
                 Book Appointment
               </Button>
             </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
         <h3 className="font-bold text-gray-900 text-lg">My Appointments</h3>
         <button className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
           February 2024
         </button>
      </div>

      {/* Date Pills */}
      <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
         {dates.map((date) => {
           const isActive = date === selectedDate;
           return (
             <button 
               key={date}
               onClick={() => setSelectedDate(date)}
               className={cn(
                 "flex flex-col items-center justify-center min-w-[50px] h-[64px] rounded-[12px] border transition-all",
                 isActive 
                   ? "bg-[#5B6CFF] border-[#5B6CFF] text-white shadow-md shadow-blue-500/20" 
                   : "bg-white border-[#E6EAF2] text-gray-500 hover:border-gray-300"
               )}
             >
               <span className="text-lg font-bold">{date}</span>
               {isActive && <div className="w-1 h-1 rounded-full bg-orange-300 mt-1" />}
               {!isActive && <div className="w-1 h-1 rounded-full bg-teal-400 mt-1" />}
             </button>
           )
         })}
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between mb-4 relative">
        <h4 className="font-bold text-gray-900">Schedule List</h4>
        <div className="flex gap-2 relative">
           {/* FILTER BUTTON & DROPDOWN */}
           <div className="relative">
             <Button 
               variant="outline" 
               size="sm" 
               className={cn("h-9 gap-2 text-gray-600 border-gray-200", filterType !== "all" && "bg-blue-50 border-blue-200 text-blue-600")}
               onClick={() => setShowFilterMenu(!showFilterMenu)}
             >
               <Filter size={16} /> 
               {filterType === "all" ? "Filter" : filterType === "video" ? "Video Only" : "Audio Only"}
             </Button>
             {showFilterMenu && (
               <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-10 flex flex-col p-1 animate-in slide-in-from-top-2 duration-200">
                 <button 
                   className={cn("text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50", filterType === "all" && "bg-gray-100 font-medium")}
                   onClick={() => { setFilterType("all"); setShowFilterMenu(false); }}
                 >
                   All Types
                 </button>
                 <button 
                   className={cn("text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50", filterType === "video" && "bg-gray-100 font-medium")}
                   onClick={() => { setFilterType("video"); setShowFilterMenu(false); }}
                 >
                   Video Calls
                 </button>
                 <button 
                   className={cn("text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50", filterType === "audio" && "bg-gray-100 font-medium")}
                   onClick={() => { setFilterType("audio"); setShowFilterMenu(false); }}
                 >
                   Audio Calls
                 </button>
               </div>
             )}
           </div>

           {/* ADD NEW BUTTON */}
           <Button 
             size="sm" 
             className="h-9 gap-2 bg-[#364a60] hover:bg-[#2c3e50]"
             onClick={() => setIsAddModalOpen(true)}
           >
             <Plus size={16} /> Book Appointment
           </Button>
        </div>
      </div>

      {/* Table-like List */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left bg-gray-50 border-b border-gray-100">
              <th className="py-3 px-4 font-medium text-gray-500 text-sm rounded-l-lg">Appoint with</th>
              <th className="py-3 px-4 font-medium text-gray-500 text-sm">Psychologist</th>
              <th className="py-3 px-4 font-medium text-gray-500 text-sm">Date & Time</th>
              <th className="py-3 px-4 font-medium text-gray-500 text-sm rounded-r-lg">Type</th>
              <th className="py-3 px-4 font-medium text-gray-500 text-sm"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt) => (
                <tr key={apt.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                       <span className={cn(
                         "w-8 h-8 rounded-full flex items-center justify-center text-xs",
                         "bg-blue-50 text-blue-600"
                       )}>
                         {apt.type.charAt(0)}
                       </span>
                       <span className="text-sm font-medium text-gray-700">{apt.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                       <Avatar className="w-8 h-8">
                         <AvatarImage src={apt.image} />
                         <AvatarFallback>{apt.psychologist.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <span className="text-sm font-semibold text-gray-900">{apt.psychologist}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {apt.day} Feb, {apt.time}
                  </td>
                  <td className="py-4 px-4 text-center">
                     {apt.mode === "video" ? (
                        <Video size={18} className="text-[#0E8B7F]" />
                     ) : (
                        <Phone size={18} className="text-[#FF9F43]" />
                     )}
                  </td>
                  <td className="py-4 px-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                       <Link href={`/patient/dashboard/messages?chatId=${apt.id}&action=call`}>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" title="Start Session">
                           <Video size={16} />
                         </Button>
                       </Link>
                       <Link href={`/patient/dashboard/messages?chatId=${apt.id}&action=reschedule`}>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50" title="Reschedule / Message">
                           <MoreVertical size={16} className="rotate-90" />
                         </Button>
                       </Link>
                     </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No appointments scheduled for this day
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
