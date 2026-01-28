"use client";

import { useState, useEffect, Suspense } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, Send, Paperclip, MoreVertical, Circle, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VideoCallPanel } from "@/components/dashboard/messages/VideoCallPanel";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
         "flex gap-6", 
         isInCall ? "items-start justify-center" : "flex-col h-[calc(100vh-8rem)]"
      )}>
        
        {/* MESSAGES CONTAINER */}
        <div 
           className={cn(
             "flex flex-col bg-white border border-[#E6EAF2] rounded-[16px] overflow-hidden transition-all duration-300 shadow-[0_8px_24px_rgba(17,24,39,0.02)]",
             isInCall 
               ? "w-[433px] h-[719px] shrink-0" // Fixed size when in call
               : "flex-1 h-full w-full"         // Full size when in normal mode
           )}
        >
          {/* Main Layout of Chat (Sidebar + Content) */}
          <div className="flex flex-1 overflow-hidden">
             
             {/* Chat List Sidebar */}
            <div className={cn(
                "border-r border-border flex flex-col w-80",
                isInCall && "hidden" 
            )}>
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                  <Input placeholder="Search..." className="pl-10" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-background transition-colors border-b border-border ${
                      selectedChatId === chat.id ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-12 w-12 border border-blue-100">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">{chat.name[0]}</AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <Circle className="absolute bottom-0 right-0 text-success fill-success" size={12} />
                      )}
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-foreground truncate">{chat.name}</span>
                      </div>
                      <p className="text-sm text-text-secondary truncate">{chat.lastMessage}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                {activeChat ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-blue-100">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">{activeChat.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{activeChat.name}</div>
                      <div className="text-xs text-text-secondary">
                        {activeChat.online ? "Online" : "Offline"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>Select a chat</div>
                )}
                
                <div className="flex gap-2">
                   {/* Video Call Button */}
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className={cn("text-gray-500 hover:text-primary hover:bg-primary/10", isInCall && "text-primary bg-primary/10")}
                     onClick={() => setIsInCall(!isInCall)}
                     title="Start Video Call"
                   >
                     <Video size={20} />
                   </Button>
                   <Button variant="ghost" size="icon">
                     <MoreVertical size={20} />
                   </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      message.sender === "patient" ? "bg-primary text-background rounded-br-sm" : "bg-background text-foreground rounded-bl-sm"
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <span className={`text-xs mt-1 block ${message.sender === "patient" ? "text-background/70" : "text-text-secondary"}`}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip size={20} />
                  </Button>
                  <Input
                    placeholder="Type..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon" className="shrink-0">
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MEETING PANEL */}
        {isInCall && (
            <div className="w-[712px] h-[729px] shrink-0">
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
