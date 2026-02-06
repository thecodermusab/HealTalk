"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, AlertTriangle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatbotInterfaceProps {
  onComplete?: (data: {
    responses: Message[];
    aiSummary: string;
    riskLevel: string;
    recommendedActions: string[];
  }) => void;
  initialUserMessage?: string | null;
}

export function ChatbotInterface({ onComplete, initialUserMessage }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm here to help match you with the right therapist. I'll ask a few questions about how you've been feeling. This will only take 5 minutes. Shall we begin?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialMessageSentRef = useRef(false);
  const messagesRef = useRef<Message[]>(messages);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  const completeAssessment = useCallback(async (allMessages: Message[], finalSummary: string) => {
    // Extract risk level from AI summary
    let riskLevel = "MEDIUM";
    const lowerSummary = finalSummary.toLowerCase();

    if (
      lowerSummary.includes("crisis") ||
      lowerSummary.includes("immediate") ||
      lowerSummary.includes("emergency")
    ) {
      riskLevel = "CRISIS";
    } else if (
      lowerSummary.includes("severe") ||
      lowerSummary.includes("high risk") ||
      lowerSummary.includes("strongly recommend")
    ) {
      riskLevel = "HIGH";
    } else if (
      lowerSummary.includes("mild") ||
      lowerSummary.includes("low risk") ||
      lowerSummary.includes("benefit from")
    ) {
      riskLevel = "LOW";
    }

    const recommendedActions =
      riskLevel === "CRISIS"
        ? [
            "Contact National Suicide Prevention Lifeline: 988",
            "Visit nearest emergency room",
            "Call 911 if in immediate danger",
          ]
        : riskLevel === "HIGH"
        ? [
            "Schedule appointment with therapist within 1 week",
            "Consider medication evaluation",
            "Join support group",
          ]
        : riskLevel === "MEDIUM"
        ? ["Schedule appointment with therapist", "Practice self-care techniques", "Monitor symptoms"]
        : ["Consider therapy for personal growth", "Practice stress management", "Maintain healthy habits"];

    const assessmentData = {
      responses: allMessages,
      aiSummary: finalSummary,
      riskLevel,
      recommendedActions,
    };

    // Save to database
    try {
      await fetch("/api/screening/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentData),
      });
    } catch (err) {
      console.error("Failed to save assessment:", err);
    }

    setIsComplete(true);
    if (onComplete) {
      onComplete(assessmentData);
    }
  }, [onComplete]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoadingRef.current) return;

    const userMessage: Message = { role: "user", content: messageText.trim() };
    const newMessages = [...messagesRef.current, userMessage];
    setMessages(newMessages);
    messagesRef.current = newMessages;
    setInput("");
    setIsLoading(true);
    isLoadingRef.current = true;
    const nextQuestionCount = newMessages.filter((message) => message.role === "user").length;
    setQuestionCount(nextQuestionCount);

    try {
      const res = await fetch("/api/screening/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      // Check if it's a crisis response (JSON)
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await res.json();
        if (data.isCrisis) {
          setMessages([...newMessages, { role: "assistant", content: data.content }]);
          setShowCrisisResources(true);
          isLoadingRef.current = false;
          setIsLoading(false);
          return;
        }
      }

      // Stream response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          setMessages([
            ...newMessages,
            { role: "assistant", content: assistantMessage },
          ]);
        }
      }

      // Check if assessment is complete (10+ questions asked)
      if (nextQuestionCount >= 10) {
        // Parse AI response for summary and risk level
        await completeAssessment(newMessages, assistantMessage);
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [completeAssessment]);

  useEffect(() => {
    if (initialUserMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true;
      void sendMessage(initialUserMessage);
    }
  }, [initialUserMessage, sendMessage]);

  return (
    <div className="flex flex-col h-full bg-white px-2 py-2 md:px-4 md:py-4">
      {/* Crisis Banner */}
      {showCrisisResources && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Crisis Resources Available 24/7</h3>
              <div className="space-y-1 text-sm text-red-700">
                <p className="flex items-center gap-2">
                  <Phone size={14} />
                  <strong>National Suicide Prevention Lifeline:</strong> 988
                </p>
                <p>
                  <strong>Crisis Text Line:</strong> Text HOME to 741741
                </p>
                <p>
                  <strong>Emergency:</strong> 911
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {!isComplete && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {Math.min(questionCount, 10)} of 10</span>
            <span>{Math.min(questionCount, 10) * 10}% complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(questionCount, 10) * 10}%` }}
            />
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-[133px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-900"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <Loader2 className="animate-spin text-gray-600" size={20} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      {!isComplete && (
        <form onSubmit={handleSubmit} className="sticky bottom-0 bg-white pt-3">
          <div className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message HealTalk..."
              className="min-h-[44px] max-h-40 flex-1 resize-none border-0 bg-transparent p-0 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              rows={1}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-9 w-9 rounded-full bg-gray-900 text-white shadow-md transition-colors hover:bg-gray-800"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </Button>
          </div>
        </form>
      )}

      {isComplete && (
        <div className="text-center py-6 bg-green-50 rounded-[24px] border border-green-200">
          <p className="text-green-800 font-semibold mb-2">Assessment Complete!</p>
          <p className="text-sm text-green-700">
            Thank you for sharing. Your results have been saved.
          </p>
        </div>
      )}
    </div>
  );
}
