"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, Send, Paperclip, MoreVertical, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PsychologistMessagesPage() {
  const chats = [
    {
      id: 1,
      patient: "John D.",
      lastMessage: "Thanks, see you tomorrow!",
      timestamp: "2 hours ago",
      unread: 1,
      online: true,
    },
    {
      id: 2,
      patient: "Sarah M.",
      lastMessage: "Can we reschedule?",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
    },
  ];

  const threadByChatId: Record<number, Array<{ id: number; sender: "psychologist" | "patient"; text: string; timestamp: string }>> = {
    1: [
      { id: 1, sender: "patient", text: "Hi Dr., I'm feeling more anxious this week.", timestamp: "9:15 AM" },
      { id: 2, sender: "psychologist", text: "Thanks for sharing. Any triggers you've noticed?", timestamp: "9:20 AM" },
      { id: 3, sender: "patient", text: "Mostly work deadlines.", timestamp: "9:22 AM" },
      { id: 4, sender: "psychologist", text: "Let's review coping techniques tomorrow.", timestamp: "9:25 AM" },
    ],
    2: [
      { id: 1, sender: "patient", text: "Can we reschedule?", timestamp: "Yesterday" },
      { id: 2, sender: "psychologist", text: "Sure, what times work for you?", timestamp: "Yesterday" },
    ],
  };

  const [selectedChatId, setSelectedChatId] = useState<number | null>(chats[0]?.id ?? null);
  const [messageInput, setMessageInput] = useState("");

  const activeChat = chats.find((chat) => chat.id === selectedChatId);
  const messages = selectedChatId ? threadByChatId[selectedChatId] ?? [] : [];

  const handleSendMessage = () => {
    if (!messageInput.trim()) {
      return;
    }
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-text-secondary">Chat with your patients</p>
        </div>

        <div className="flex-1 flex bg-card border border-border rounded-xl overflow-hidden">
          <div className="w-80 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <Input placeholder="Search patients..." className="pl-10" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chats.length === 0 && (
                <div className="p-6 text-sm text-text-secondary">
                  No messages yet.
                </div>
              )}
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-background transition-colors border-b border-border ${
                    selectedChatId === chat.id ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">
                        {chat.patient[0]}
                      </span>
                    </div>
                    {chat.online && (
                      <Circle
                        className="absolute bottom-0 right-0 text-success fill-success"
                        size={12}
                      />
                    )}
                  </div>

                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground truncate">
                        {chat.patient}
                      </span>
                      {chat.unread > 0 && (
                        <span className="bg-primary text-background text-xs rounded-full px-2 py-0.5 ml-2">
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

          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              {activeChat ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">
                      {activeChat.patient[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {activeChat.patient}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {activeChat.online ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-text-secondary">Select a conversation</div>
              )}
              <Button variant="ghost" size="sm">
                <MoreVertical size={20} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-sm text-text-secondary">
                  No messages in this conversation yet.
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "psychologist" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === "psychologist"
                        ? "bg-primary text-background rounded-br-sm"
                        : "bg-background text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.sender === "psychologist"
                          ? "text-background/70"
                          : "text-text-secondary"
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip size={20} />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                  disabled={!activeChat}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-primary/90"
                  disabled={!messageInput.trim() || !activeChat}
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
