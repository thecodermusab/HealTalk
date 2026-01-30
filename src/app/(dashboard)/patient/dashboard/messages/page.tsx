"use client";

import { useState, useEffect, Suspense } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, Send, Paperclip, MoreVertical, Circle, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VideoCallPanel } from "@/components/dashboard/messages/VideoCallPanel";
import { useSearchParams } from "next/navigation";

function MessagesContent() {
  const searchParams = useSearchParams();
  const chatIdParam = searchParams.get("chatId");
  
  // Mock Data: Psychologists for the patient to chat with
  const chats = [
    {
      id: 1,
      name: "Dr. Ahmet Yılmaz",
      lastMessage: "See you at the session.",
      timestamp: "2 hours ago",
      unread: 1,
      online: true,
      role: "Psychologist"
    },
    {
      id: 2,
      name: "Dr. Ayşe Demir",
      lastMessage: "Please fill out the form.",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
      role: "Psychologist"
    },
  ];

  const threadByChatId: Record<number, Array<{ id: number; sender: "psychologist" | "patient"; text: string; timestamp: string }>> = {
    1: [
      { id: 1, sender: "patient", text: "Hi Dr. Yılmaz, I had a question about the homework.", timestamp: "9:15 AM" },
      { id: 2, sender: "psychologist", text: "Of course, go ahead.", timestamp: "9:20 AM" },
      { id: 3, sender: "patient", text: "Should I do it daily?", timestamp: "9:22 AM" },
      { id: 4, sender: "psychologist", text: "Yes, daily is best for consistency.", timestamp: "9:25 AM" },
    ],
    2: [
      { id: 1, sender: "psychologist", text: "Please fill out the form.", timestamp: "Yesterday" },
    ],
  };

  const [selectedChatId, setSelectedChatId] = useState<number | null>(() => {
    if (chatIdParam) {
      const id = parseInt(chatIdParam);
      if (chats.find(c => c.id === id)) return id;
    }
    return chats[0]?.id ?? null;
  });
  
  // Update state if URL param changes while on page
  useEffect(() => {
    if (chatIdParam) {
      const id = parseInt(chatIdParam);
      if (chats.find(c => c.id === id)) {
        setSelectedChatId(id);
      }
    }
  }, [chatIdParam]);

  const [messageInput, setMessageInput] = useState("");
  const [isInCall, setIsInCall] = useState(false);

  const activeChat = chats.find((chat) => chat.id === selectedChatId);
  const messages = selectedChatId ? threadByChatId[selectedChatId] ?? [] : [];

  // Handle URL actions
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "call") {
      setIsInCall(true);
    } else if (action === "reschedule") {
      setMessageInput("Hi Dr., I'd like to request a reschedule for our upcoming appointment.");
    }
  }, [searchParams]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) {
      return;
    }
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  return (
    <DashboardLayout>
      <div className={cn(
         "flex gap-6 h-[calc(100vh-8rem)]", // Fixed height to fill remaining space
         isInCall ? "items-start justify-center" : "flex-col"
      )}>
        
        {/* MESSAGES CONTAINER */}
        <div 
           className={cn(
             "flex bg-white border border-[#E6EAF2] rounded-[24px] overflow-hidden shadow-sm transition-all duration-300",
             isInCall 
               ? "w-[400px] h-[600px] flex-col shrink-0" 
               : "flex-1 h-full w-full flex-row"
           )}
        >
           {/* Chats List Side */}
           <div className={cn(
               "border-r border-[#E6EAF2] flex flex-col transition-all duration-300",
               isInCall ? "hidden" : "w-80"
           )}>
              <div className="p-6 border-b border-[#E6EAF2]">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input placeholder="Search doctors..." className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-xl" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={cn(
                        "w-full p-4 flex items-start gap-4 transition-all border-b border-gray-50 hover:bg-gray-50 text-left relative",
                        selectedChatId === chat.id ? "bg-[#F4F7FF] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#5B6CFF]" : ""
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={cn(
                          "w-12 h-12 rounded-[14px] flex items-center justify-center text-lg font-bold shadow-sm",
                          selectedChatId === chat.id ? "bg-[#5B6CFF] text-white" : "bg-[#EEF0FF] text-[#5B6CFF]"
                      )}>
                        {chat.name.split(" ")[1][0]}
                      </div>
                      {chat.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <Circle className="text-[#20C997] fill-[#20C997] w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn("font-bold truncate", selectedChatId === chat.id ? "text-[#5B6CFF]" : "text-gray-900")}>
                            {chat.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">{chat.timestamp}</span>
                      </div>
                      <p className={cn("text-xs truncate", selectedChatId === chat.id ? "text-gray-600 font-medium" : "text-gray-500")}>
                          {chat.lastMessage}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
           </div>

           {/* Chat Content Side */}
           <div className="flex-1 flex flex-col min-w-0 bg-white">
              {/* Header */}
              <div className="h-[88px] flex items-center justify-between px-8 border-b border-[#E6EAF2]">
                {activeChat ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-[#EEF0FF] flex items-center justify-center text-[#5B6CFF] font-bold text-lg">
                      {activeChat.name.split(" ")[1][0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{activeChat.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", activeChat.online ? "bg-[#20C997]" : "bg-gray-300")} />
                        <span className="text-xs text-gray-500 font-medium">{activeChat.online ? "Online Now" : "Offline"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">Select a chat to start messaging</div>
                )}
                
                <div className="flex items-center gap-3">
                   <Button 
                     variant="outline" 
                     className="h-10 w-10 p-0 rounded-xl border-gray-200 text-gray-500 hover:text-[#5B6CFF] hover:bg-[#EEF0FF] hover:border-[#5B6CFF]"
                     onClick={() => setIsInCall(!isInCall)}
                     title="Start Video Call"
                   >
                     <Video size={18} />
                   </Button>
                   <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-gray-50 text-gray-400">
                     <MoreVertical size={18} />
                   </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FAFBFC]">
                {messages.map((message) => {
                    const isMe = message.sender === "patient";
                    return (
                      <div key={message.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "max-w-[70%] p-4 shadow-sm",
                            isMe 
                                ? "bg-[#5B6CFF] text-white rounded-[20px] rounded-tr-none" 
                                : "bg-white text-gray-700 border border-[#E6EAF2] rounded-[20px] rounded-tl-none"
                        )}>
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <span className={cn("text-[10px] block mt-1.5 text-right opacity-80", isMe ? "text-blue-100" : "text-gray-400")}>
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                })}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-[#E6EAF2]">
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-[16px] border border-[#E6EAF2]">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white hover:shadow-sm">
                    <Paperclip size={20} />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-gray-400"
                  />
                  <Button onClick={handleSendMessage} className="bg-[#5B6CFF] hover:bg-[#4a5ae0] text-white h-10 w-10 rounded-[12px] p-0 shadow-md shadow-blue-500/20">
                    <Send size={18} />
                  </Button>
                </div>
              </div>
           </div>
        </div>

        {/* MEETING PANEL */}
        {isInCall && (
            <div className="flex-1 h-[720px] bg-black rounded-[24px] overflow-hidden shadow-2xl relative">
                <VideoCallPanel 
                   roomName={`healtalk-patient-${selectedChatId}`} 
                   onEndCall={() => setIsInCall(false)}
                />
            </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default function PatientMessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
