"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
  { name: "8-15", value: 17 },
  { name: "16-20", value: 45 },
  { name: "21-29", value: 102, active: true },
  { name: "30-45", value: 148 },
  { name: "46-60", value: 58 },
  { name: "61-80", value: 3 },
];

export function PatientsOverviewChart() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6EAF2] p-6 shadow-[0_8px_24px_rgba(17,24,39,0.02)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-gray-900 text-lg">Patients Overview</h3>
        <button className="flex items-center gap-2 text-sm text-gray-500 border border-[#E6EAF2] rounded-lg px-3 py-1.5 hover:bg-gray-50">
           This Month
           <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex-1 min-h-[250px] w-full">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={48}>
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
                     fill={entry.active ? '#5B6CFF' : '#EEF0FF'} 
                   />
                 ))}
                 <LabelList 
                    dataKey="value" 
                    position="top" 
                    offset={10}
                    formatter={(value: number) => value < 10 ? `0${value}` : value}
                    style={{ fill: '#6B7280', fontSize: '12px', fontWeight: 500 }}
                 />
               </Bar>
            </BarChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}
