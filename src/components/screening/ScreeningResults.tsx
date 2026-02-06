"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, AlertCircle, Info, Copy, ThumbsUp, RotateCcw, Send, Mic, Paperclip, Compass, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ScreeningResultsProps {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRISIS";
  aiSummary: string;
  recommendedActions: string[];
}

export function ScreeningResults({
  riskLevel,
  aiSummary,
  recommendedActions,
}: ScreeningResultsProps) {
  const router = useRouter();

  const riskConfig = {
    LOW: {
      color: "green",
      icon: CheckCircle2,
      title: "Low Risk",
      description: "You're experiencing mild symptoms.",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
    MEDIUM: {
      color: "yellow",
      icon: Info,
      title: "Moderate Risk",
      description: "Moderate symptoms detected.",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
    },
    HIGH: {
      color: "orange",
      icon: AlertCircle,
      title: "High Risk",
      description: "Severe symptoms detected.",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
    },
    CRISIS: {
      color: "red",
      icon: AlertTriangle,
      title: "Crisis Level",
      description: "Immediate support needed.",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
    },
  };

  const config = riskConfig[riskLevel];
  const Icon = config.icon;

  return (
    <div className="flex flex-col h-full bg-white text-[#2B2B2B] font-sans relative">
        
        {/* Chat Content Area */}
        <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 overflow-y-auto">
            
            {/* User Message (Context) */}
            <div className="flex justify-end mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <div className="bg-[#F4F4F4] text-[#2B2B2B] px-5 py-3 rounded-[24px] rounded-br-none max-w-[80%] text-base leading-relaxed">
                    Complete my mental health assessment and provide a summary with next steps.
                 </div>
            </div>

            {/* AI Response */}
            <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                 <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1">
                    {/* Replaced Image with Icon for reliability if asset missing, or use Brain */}
                     <Brain size={16} className="text-white" />
                 </div>
                 
                 <div className="flex-1 space-y-6">
                     <div className="prose prose-slate max-w-none">
                        <p className="tex-lg leading-relaxed text-gray-800">
                             Based on your responses, I've analyzed your current mental well-being status. Here is your personalized summary and recommended actions.
                        </p>
                     </div>

                     {/* Result Card styled as part of the message */}
                     <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <div className={cn("p-4 border-b border-gray-100 flex items-center gap-3", config.bgColor)}>
                             <Icon size={20} className={config.textColor} />
                             <div>
                                 <h3 className={cn("font-semibold", config.textColor)}>{config.title}</h3>
                             </div>
                        </div>
                        <div className="p-5 bg-[#FAFAFA space-y-4">
                            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {aiSummary}
                            </div>
                        </div>
                     </div>

                     {/* Recommendations */}
                     <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Recommended Next Steps:</h4>
                        <ul className="grid grid-cols-1 gap-2">
                             {recommendedActions.map((action, i) => (
                                 <li key={i} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                                     <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
                                         {i+1}
                                     </span>
                                     {action}
                                 </li>
                             ))}
                        </ul>
                     </div>

                     {/* Crisis Warning */}
                     {riskLevel === "CRISIS" && (
                         <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-800 text-sm flex gap-3">
                             <AlertTriangle size={20} className="flex-shrink-0" />
                             <div>
                                 <p className="font-bold">Immediate Assistance Recommended</p>
                                 <p className="mt-1">Please consider contacting emergency services (911) or the Crisis Lifeline (988) immediately.</p>
                             </div>
                         </div>
                     )}

                     {/* Message Actions */}
                     <div className="flex items-center gap-2 pt-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 rounded-full">
                             <Copy size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 rounded-full">
                             <RotateCcw size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 rounded-full">
                             <ThumbsUp size={16} />
                        </Button>
                     </div>

                     {/* Main CTAs */}
                     <div className="flex flex-wrap gap-3 pt-4">
                         <Button onClick={() => router.push("/find-psychologists")} className="bg-black hover:bg-gray-800 text-white rounded-full">
                             Find a Therapist
                         </Button>
                         <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full border-gray-200">
                             Retake Assessment
                         </Button>
                     </div>
                 </div>
            </div>

            <div className="h-24" /> {/* Spacer for bottom bar */}
        </div>

        {/* Bottom Input Area (Visual only or Functional) */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-white via-white to-transparent">
             <div className="max-w-3xl mx-auto w-full relative">
                 <div className="bg-white rounded-[2rem] shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-gray-200 p-2 flex items-center gap-2">
                     <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-50 rounded-full w-10 h-10">
                         <Paperclip size={20} />
                     </Button>
                     <input 
                        type="text" 
                        placeholder="Ask anything..." 
                        className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 h-10 px-2"
                        disabled
                     />
                     <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-50 rounded-full w-10 h-10">
                         <Mic size={20} />
                     </Button>
                     <Button size="icon" className="bg-gray-200 text-gray-500 hover:bg-gray-300 rounded-full w-10 h-10 shadow-none">
                         <Send size={18} />
                     </Button>
                 </div>
                 <div className="text-center mt-2">
                     <p className="text-[10px] text-gray-400">HealTalk AI can make mistakes. Please verify important info.</p>
                 </div>
             </div>
        </div>

    </div>
  );
}
