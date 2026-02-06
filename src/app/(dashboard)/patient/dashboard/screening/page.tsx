"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ChatbotInterface } from "@/components/screening/ChatbotInterface";
import { ScreeningResults } from "@/components/screening/ScreeningResults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Paperclip, Send, Brain, Calendar, Loader2, ArrowLeft, PenTool, Sparkles, Zap, Box, Compass } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Assessment {
  id: string;
  completedAt: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRISIS";
  aiSummary: string;
  createdAt: string;
}

export default function PatientScreeningPage() {
  const [view, setView] = useState<"list" | "chat" | "results">("list");
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [currentResults, setCurrentResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  const chips = [
    { id: "fast", label: "Fast", icon: Zap },
    { id: "indepth", label: "In-depth", icon: Sparkles },
    { id: "holistic", label: "Holistic", icon: Box },
    { id: "journal", label: "Journal", icon: PenTool },
  ];

  const riskLevelColors = {
    LOW: "bg-green-100 text-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-orange-100 text-orange-800",
    CRISIS: "bg-red-100 text-red-800",
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  async function fetchAssessments() {
    try {
      const res = await fetch("/api/screening");
      if (res.ok) {
        const data = await res.json();
        setAssessments(data.assessments || []);
      }
    } catch (err) {
      console.error("Error fetching assessments:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleAssessmentComplete(data: any) {
    setCurrentResults(data);
    setView("results");
    fetchAssessments();
  }

  function handleStartNewAssessment(message?: string) {
    // Handle case where message might be an event object from onClick
    const messageText = typeof message === 'string' ? message : '';
    const trimmedMessage = messageText.trim();
    setInitialMessage(trimmedMessage ? trimmedMessage : null);
    setView("chat");
    setCurrentResults(null);
    setQuery("");
  }

  return (
    <DashboardLayout>
      <div className="relative min-h-[calc(100vh-100px)] w-full bg-white pb-[133px] text-[#2B2B2B] overflow-hidden font-sans">

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-6 md:p-12">
            
            {/* VIEW: MAIN (Search/Hero + List) */}
            {view === "list" && (
                <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                    
                    {/* Hero Section */}
                    <div className="flex flex-col items-center text-center space-y-6 mb-12">
                        {/* Assuming logo might be desired, but reference focuses on text. Keeping simple text hero per reference. */}
                        <div className="space-y-2">
                             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1a1a]">
                                Hi, I'm HealTalk AI
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-500 font-normal">
                                How can I help you today?
                            </p>
                        </div>

                        {/* Suggestion Chips */}
                        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-6">
                            {chips.map((chip) => (
                                <button
                                    key={chip.id}
                                    onClick={() => handleStartNewAssessment()}
                                    className="group flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                                >
                                    <div className="p-1 rounded-full bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                                        <chip.icon size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{chip.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                     {/* Past Assessments (Pushing to bottom or discreet area if user has them) 
                        Reference doesn't show history, but user wants to keep content. 
                        Let's put it unobtrusively below the main interaction area.
                     */}
                    {assessments.length > 0 && (
                        <div className="w-full max-w-2xl mt-8">
                            <div className="text-center mb-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Recent Check-ins</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-80 hover:opacity-100 transition-opacity">
                                {assessments.slice(0, 2).map((assessment) => (
                                    <div
                                        key={assessment.id}
                                        className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md cursor-pointer transition-all"
                                    >
                                        <div className={`w-2 h-2 rounded-full ${assessment.riskLevel === 'LOW' ? 'bg-green-400' : 'bg-orange-400'}`} />
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-sm font-medium text-gray-900 truncate">{assessment.aiSummary}</p>
                                            <p className="text-xs text-gray-500">{format(new Date(assessment.completedAt), "MMM d")}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Spacer to push Input Card down */}
                    <div className="flex-grow" />

                    {/* Bottom Input Card */}
                    <div className="w-full max-w-3xl mt-12 mb-4">
                        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-2 md:p-3 relative group focus-within:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow duration-300">
                            
                            <div className="px-4 py-3">
                                <Input 
                                    type="text"
                                    placeholder="Ask anything..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleStartNewAssessment(query);
                                        }
                                    }}
                                    className="border-0 bg-transparent shadow-none text-gray-800 placeholder:text-gray-400 text-lg h-auto focus-visible:ring-0 p-0 font-normal w-full"
                                />
                            </div>

                            <div className="flex items-center justify-between px-2 pb-1 mt-4">
                                {/* Left Actions Pills */}
                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-600 transition-colors whitespace-nowrap">
                                        <Paperclip size={14} className="text-gray-500" />
                                        Attach
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-600 transition-colors whitespace-nowrap">
                                        <Mic size={14} className="text-gray-500" />
                                        Voice Message
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-xs font-medium text-gray-600 transition-colors whitespace-nowrap">
                                        <Compass size={14} className="text-gray-500" />
                                        Browse Prompts
                                    </button>
                                </div>

                                {/* Right Actions: Counter + Send */}
                                <div className="flex items-center gap-4 pl-4 bg-white">
                                    <span className="text-xs font-medium text-gray-400 tabular-nums">0/3000</span>
                                    <Button 
                                        size="icon" 
                                        onClick={() => handleStartNewAssessment(query)}
                                        className="h-10 w-10 rounded-xl bg-black hover:bg-gray-800 text-white shadow-md transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Send size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/* Disclaimer */}
                        <div className="text-center mt-3">
                            <p className="text-[10px] text-gray-400">
                                HealTalk AI may provide responses that aren't always accurate. Please verify critical information.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: CHAT INTERFACE */}
            {view === "chat" && (
                <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            onClick={() => setView("list")}
                            variant="ghost"
                            className="text-gray-600 hover:bg-gray-100 rounded-full gap-2"
                        >
                            <ArrowLeft size={20} />
                            Back
                        </Button>
                        <h2 className="text-xl font-bold text-gray-900">Assessment</h2>
                        <div className="w-20" /> 
                    </div>
                    
                    <div className="flex-1 relative">
                         {/* Chatbot with light theme overrides if needed, assuming component handles transparency well or has its own white bg */}
                        <ChatbotInterface onComplete={handleAssessmentComplete} initialUserMessage={initialMessage} />
                    </div>
                </div>
            )}

            {/* VIEW: RESULTS */}
            {view === "results" && currentResults && (
                 <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            onClick={() => setView("list")}
                            variant="ghost"
                            className="text-gray-600 hover:bg-gray-100 rounded-full gap-2"
                        >
                            <ArrowLeft size={20} />
                            Home
                        </Button>
                         <h2 className="text-xl font-bold text-gray-900">Results</h2>
                        <div className="w-20" />
                    </div>
                    
                    <div className="flex-1 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl p-6 overflow-y-auto">
                        <ScreeningResults
                            riskLevel={currentResults.riskLevel}
                            aiSummary={currentResults.aiSummary}
                            recommendedActions={currentResults.recommendedActions}
                        />
                    </div>
                </div>
            )}

        </div>
      </div>
    </DashboardLayout>
  );
}
