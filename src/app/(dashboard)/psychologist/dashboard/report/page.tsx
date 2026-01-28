"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Clock, Star, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const data = [
  { name: 'Mon', visits: 40, sessions: 24 },
  { name: 'Tue', visits: 30, sessions: 13 },
  { name: 'Wed', visits: 20, sessions: 98 },
  { name: 'Thu', visits: 27, sessions: 39 },
  { name: 'Fri', visits: 18, sessions: 48 },
  { name: 'Sat', visits: 23, sessions: 38 },
  { name: 'Sun', visits: 34, sessions: 43 },
];

const reports = [
  { id: 1, title: "Monthly Patient Summary", date: "Oct 24, 2024", type: "PDF", size: "2.4 MB" },
  { id: 2, title: "Q3 Earnings Report", date: "Sep 30, 2024", type: "CSV", size: "1.1 MB" },
  { id: 3, title: "Patient Satisfaction Survey", date: "Sep 15, 2024", type: "PDF", size: "3.2 MB" },
  { id: 4, title: "Weekly Appointment Log", date: "Sep 07, 2024", type: "XLS", size: "845 KB" },
];

export default function ReportPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Reports & Analytics</h1>
            <p className="text-text-secondary">Track your performance and practice growth</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="gap-2">
               <Calendar size={16} /> Last 30 Days
             </Button>
             <Button className="bg-[#5B6CFF] hover:bg-[#4a5ae0] gap-2">
               <Download size={16} /> Export Data
             </Button>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white p-6 rounded-[16px] border border-[#E6EAF2] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#5B6CFF]">
                    <TrendingUp size={20} />
                 </div>
                 <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+12.5%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">$12,450</h3>
              <p className="text-sm text-gray-500">Total Earnings</p>
           </div>
           
           <div className="bg-white p-6 rounded-[16px] border border-[#E6EAF2] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                    <Users size={20} />
                 </div>
                 <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+5.2%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">482</h3>
              <p className="text-sm text-gray-500">Total Patients</p>
           </div>

           <div className="bg-white p-6 rounded-[16px] border border-[#E6EAF2] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                    <Clock size={20} />
                 </div>
                 <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">0%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">124h</h3>
              <p className="text-sm text-gray-500">Hours Consulted</p>
           </div>

           <div className="bg-white p-6 rounded-[16px] border border-[#E6EAF2] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                    <Star size={20} />
                 </div>
                 <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+0.2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">4.9</h3>
              <p className="text-sm text-gray-500">Average Rating</p>
           </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Main Activity Chart */}
           <div className="lg:col-span-2 bg-white p-6 rounded-[16px] border border-[#E6EAF2] shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-6">Activity Overview</h3>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data}>
                     <defs>
                       <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#5B6CFF" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#5B6CFF" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6EAF2" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                     <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                       cursor={{ stroke: '#5B6CFF', strokeWidth: 1, strokeDasharray: '4 4' }}
                     />
                     <Area 
                       type="monotone" 
                       dataKey="sessions" 
                       stroke="#5B6CFF" 
                       strokeWidth={3}
                       fillOpacity={1} 
                       fill="url(#colorVisits)" 
                     />
                   </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Download Reports Card */}
           <div className="bg-white p-6 rounded-[16px] border border-[#E6EAF2] shadow-sm flex flex-col">
              <h3 className="font-bold text-gray-900 text-lg mb-6">Recent Reports</h3>
              <div className="flex-1 space-y-4">
                 {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 rounded-xl border border-[#E6EAF2] hover:bg-gray-50 transition-colors group cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 font-bold text-xs uppercase">
                             {report.type}
                          </div>
                          <div>
                             <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#5B6CFF] transition-colors">{report.title}</h4>
                             <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
                          </div>
                       </div>
                       <Download size={18} className="text-gray-400 group-hover:text-[#5B6CFF]" />
                    </div>
                 ))}
              </div>
              <Button variant="outline" className="w-full mt-6">View All Reports</Button>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
