"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
  { name: "Mon", value: 45 },
  { name: "Tue", value: 60 },
  { name: "Wed", value: 90, active: true },
  { name: "Thu", value: 30 },
  { name: "Fri", value: 45 },
  { name: "Sat", value: 20 },
  { name: "Sun", value: 10 },
];

export function PatientActivityChart() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-gray-900 text-lg">My Activity</h3>
        <button className="flex items-center gap-2 text-sm text-gray-500 border border-[#E6EAF2] rounded-lg px-3 py-1.5 hover:bg-gray-50">
           This Week
           <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex-1 min-h-[250px] w-full">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={32}>
               <XAxis 
                 dataKey="name" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                 dy={10}
               />
               <Tooltip 
                 cursor={{ fill: 'transparent' }}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
               />
               <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                 {data.map((entry, index) => (
                   <Cell 
                     key={`cell-${index}`} 
                     fill={entry.active ? '#20C997' : '#E6F8F3'} 
                   />
                 ))}
               </Bar>
            </BarChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}
