"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, AlertTriangle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ASSESSMENT_QUESTION_THRESHOLD,
  CRISIS_KEYWORDS,
  EMERGENCY_NUMBERS,
} from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Infers a risk level string from the AI's final summary text.
 * The AI includes keywords like "severe", "mild", or "crisis" in its assessment.
 */
function detectRiskLevel(summary: string): "LOW" | "MEDIUM" | "HIGH" | "CRISIS" {
  const lower = summary.toLowerCase();
  if (
    lower.includes("crisis") ||
    lower.includes("immediate") ||
    lower.includes("emergency")
  ) {
    return "CRISIS";
  }
  if (
    lower.includes("severe") ||
    lower.includes("high risk") ||
    lower.includes("strongly recommend")
  ) {
    return "HIGH";
  }
  if (
    lower.includes("mild") ||
    lower.includes("low risk") ||
    lower.includes("benefit from")
  ) {
    return "LOW";
  }
  return "MEDIUM";
}

/**
 * Maps a risk level to a list of recommended next steps shown to the patient.
 */
function getCrisisResources(riskLevel: string): string[] {
  switch (riskLevel) {
    case "CRISIS":
      return [
        `Contact National Suicide Prevention Lifeline: ${EMERGENCY_NUMBERS.crisis}`,
        "Visit nearest emergency room",
        `Call ${EMERGENCY_NUMBERS.emergency} if in immediate danger`,
      ];
    case "HIGH":
      return [
        "Schedule appointment with therapist within 1 week",
        "Consider medication evaluation",
        "Join support group",
      ];
    case "LOW":
      return [
        "Consider therapy for personal growth",
        "Practice stress management",
        "Maintain healthy habits",
      ];
    default: // MEDIUM
      return [
        "Schedule appointment with therapist",
        "Practice self-care techniques",
        "Monitor symptoms",
      ];
  }
}

/**
 * Returns true if the user message contains any crisis-level keyword.
 * Uses the same keyword list as the server-side check for consistency.
 */
function messageContainsCrisisKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword));
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  // Refs mirror state so that callbacks/closures always read the latest values
  // without needing to be re-created every render (important for the streaming loop).
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

  /** Saves the completed assessment to the DB and notifies the parent. */
  const completeAssessment = useCallback(
    async (allMessages: Message[], finalSummary: string) => {
      const riskLevel = detectRiskLevel(finalSummary);
      const recommendedActions = getCrisisResources(riskLevel);

      const assessmentData = {
        responses: allMessages,
        aiSummary: finalSummary,
        riskLevel,
        recommendedActions,
      };

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
      onComplete?.(assessmentData);
    },
    [onComplete]
  );

  /** Streams the AI response and appends it to the message list token-by-token. */
  const streamAIResponse = async (
    newMessages: Message[],
    response: Response
  ): Promise<string> => {
    const reader = response.body?.getReader();
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

    return assistantMessage;
  };

  /**
   * Main message handler — builds the payload, sends it to the API,
   * handles streaming, and triggers assessment completion when enough
   * questions have been answered.
   */
  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isLoadingRef.current) return;

      const userMessage: Message = { role: "user", content: messageText.trim() };
      const newMessages = [...messagesRef.current, userMessage];
      setMessages(newMessages);
      messagesRef.current = newMessages;
      setInput("");
      setIsLoading(true);
      isLoadingRef.current = true;

      const nextQuestionCount = newMessages.filter((m) => m.role === "user").length;
      setQuestionCount(nextQuestionCount);

      try {
        // Client-side crisis pre-check for immediate UI feedback.
        // The server will also check, but this shows the banner without waiting for the API.
        if (messageContainsCrisisKeyword(messageText)) {
          setShowCrisisResources(true);
        }

        const res = await fetch("/api/screening/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to get response");
        }

        // The API returns JSON for crisis responses, streaming text for normal replies.
        const contentType = res.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const data = await res.json();
          if (data.isCrisis) {
            setMessages([...newMessages, { role: "assistant", content: data.content }]);
            setShowCrisisResources(true);
            return;
          }
        }

        const assistantMessage = await streamAIResponse(newMessages, res);

        // Once the patient has answered enough questions, finalise the assessment.
        if (nextQuestionCount >= ASSESSMENT_QUESTION_THRESHOLD) {
          await completeAssessment(newMessages, assistantMessage);
        }
      } catch (err: unknown) {
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
    },
    [completeAssessment]
  );

  // Send the optional pre-filled message once on mount (used by the onboarding flow).
  useEffect(() => {
    if (initialUserMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true;
      void sendMessage(initialUserMessage);
    }
  }, [initialUserMessage, sendMessage]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-white px-2 py-2 md:px-4 md:py-4">
      {/* Crisis Banner — shown immediately when a crisis keyword is detected */}
      {showCrisisResources && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Crisis Resources Available 24/7</h3>
              <div className="space-y-1 text-sm text-red-700">
                <p className="flex items-center gap-2">
                  <Phone size={14} />
                  <strong>National Suicide Prevention Lifeline:</strong> {EMERGENCY_NUMBERS.crisis}
                </p>
                <p>
                  <strong>Crisis Text Line:</strong> Text HOME to {EMERGENCY_NUMBERS.text}
                </p>
                <p>
                  <strong>Emergency:</strong> {EMERGENCY_NUMBERS.emergency}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {!isComplete && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {Math.min(questionCount, ASSESSMENT_QUESTION_THRESHOLD)} of {ASSESSMENT_QUESTION_THRESHOLD}</span>
            <span>{Math.min(questionCount, ASSESSMENT_QUESTION_THRESHOLD) * (100 / ASSESSMENT_QUESTION_THRESHOLD)}% complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(questionCount, ASSESSMENT_QUESTION_THRESHOLD) * (100 / ASSESSMENT_QUESTION_THRESHOLD)}%` }}
            />
          </div>
        </div>
      )}

      {/* Message list */}
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

      {/* Input area — hidden once assessment is complete */}
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

