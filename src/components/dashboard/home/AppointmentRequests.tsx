"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const requests = [
  {
    id: 1,
    name: "Uthman ibn Hunaif",
    image: "/images/Mustaf.png",
    time: "06 Feb, 11:00 am - 11:45 am",
    type: "Individual Counselling"
  },
  {
    id: 2,
    name: "Sa'd ibn Mu'adh",
    image: "/images/koonfur.png",
    time: "08 Feb, 4:00 am - 5:00 pm",
    type: "Couple Counselling"
  },
  {
    id: 3,
    name: "Zubayr ibn al-Awwam",
    image: "/images/ciro.png",
    time: "08 Feb, 8:00 pm - 9:00 pm",
    type: "Family Counselling"
  },
  {
    id: 4,
    name: "Khalil Ahmed",
    image: "/images/Me.png",
    time: "10 Feb, 11:00 am - 12:00 am",
    type: "Family Counselling"
  },
];

export function AppointmentRequests() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] h-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
         <h3 className="font-bold text-gray-900 text-lg">Appoint Request</h3>
         <a href="#" className="text-sm text-[#5B6CFF] hover:underline font-medium">See All</a>
       </div>

       <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          {requests.map((req) => (
             <div key={req.id} className="border border-[#E6EAF2] rounded-[12px] p-4 bg-white hover:border-[#5B6CFF]/30 transition-colors">
                 <div className="flex gap-4 mb-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={req.image} />
                      <AvatarFallback>{req.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                       <h4 className="font-bold text-gray-900 text-sm">{req.name}</h4>
                       <p className="text-xs text-gray-500 mt-0.5">{req.time}</p>
                       <p className="text-xs text-[#5B6CFF] mt-1">{req.type}</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-3">
                    <Button 
                      variant="ghost" 
                      className="flex-1 h-8 text-xs bg-[#FFF5F5] text-[#FF6B6B] hover:bg-[#FFE0E0] hover:text-[#FF6B6B]"
                      onClick={() => console.log("Rejected request", req.id)}
                    >
                       Reject
                    </Button>
                    <Link href={`/psychologist/dashboard/messages?chatId=${req.id}`} className="flex-1">
                      <Button variant="ghost" className="w-full h-8 text-xs bg-[#EEF0FF] text-[#5B6CFF] hover:bg-[#E0E4FF] hover:text-[#5B6CFF]">
                         Accept
                      </Button>
                    </Link>
                 </div>
             </div>
          ))}
       </div>
    </div>
  );
}
