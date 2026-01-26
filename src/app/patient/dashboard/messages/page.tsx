"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, Send, Paperclip, MoreVertical, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageInput, setMessageInput] = useState("");

  const chats = [
    {
      id: 1,
      psychologist: "Dr. Ahmet Yılmaz",
      lastMessage: "Great! See you tomorrow at 2 PM",
      timestamp: "2 hours ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      psychologist: "Dr. Ayşe Demir",
      lastMessage: "How are you feeling today?",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "psychologist",
      text: "Hello John! How have you been feeling this week?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "patient",
      text: "Hi Dr. Yılmaz! I've been doing better, thank you.",
      timestamp: "10:35 AM",
    },
    {
      id: 3,
      sender: "psychologist",
      text: "That's wonderful to hear! Are you still practicing the breathing exercises we discussed?",
      timestamp: "10:36 AM",
    },
    {
      id: 4,
      sender: "patient",
      text: "Yes, I've been doing them every morning. They really help me start the day calmly.",
      timestamp: "10:40 AM",
    },
    {
      id: 5,
      sender: "psychologist",
      text: "Excellent! Keep it up. I'm looking forward to our session tomorrow.",
      timestamp: "11:15 AM",
    },
    {
      id: 6,
      sender: "patient",
      text: "Great! See you tomorrow at 2 PM",
      timestamp: "2 hours ago",
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending:", messageInput);
      setMessageInput("");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-text-secondary">Chat with your psychologists</p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex bg-white border border-border rounded-xl overflow-hidden">
          {/* Chat List Sidebar */}
          <div className="w-80 border-r border-border flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <Input
                  placeholder="Search messages..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-background transition-colors border-b border-border ${
                    selectedChat === chat.id ? "bg-primary/5" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">
                        {chat.psychologist.split(" ")[1][0]}
                      </span>
                    </div>
                    {chat.online && (
                      <Circle
                        className="absolute bottom-0 right-0 text-success fill-success"
                        size={12}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground truncate">
                        {chat.psychologist}
                      </span>
                      {chat.unread > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 ml-2">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary truncate">
                      {chat.lastMessage}
                    </p>
                    <span className="text-xs text-text-secondary">
                      {chat.timestamp}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">Y</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    Dr. Ahmet Yılmaz
                  </div>
                  <div className="text-xs text-success">Online</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical size={20} />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "patient" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === "patient"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-background text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.sender === "patient"
                          ? "text-white/70"
                          : "text-text-secondary"
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip size={20} />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-primary/90"
                  disabled={!messageInput.trim()}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
