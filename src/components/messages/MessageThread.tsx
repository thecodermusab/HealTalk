"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { Paperclip, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/lib/uploadthing";

type MessageRecord = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  read?: boolean;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  attachmentName?: string | null;
};

type AppointmentMeta = {
  id: string;
  patientName: string;
  psychologistName: string;
  patientUserId: string;
  psychologistUserId: string;
};

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export function MessageThread({ appointmentId }: { appointmentId: string }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [appointment, setAppointment] = useState<AppointmentMeta | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const [pendingAttachment, setPendingAttachment] = useState<{
    url: string;
    key?: string;
    type?: string;
    name?: string;
  } | null>(null);

  const otherName = useMemo(() => {
    if (!appointment || !session?.user?.id) return "Conversation";
    return session.user.id === appointment.patientUserId
      ? appointment.psychologistName
      : appointment.patientName;
  }, [appointment, session?.user?.id]);

  const otherUserId = useMemo(() => {
    if (!appointment || !session?.user?.id) return "";
    return session.user.id === appointment.patientUserId
      ? appointment.psychologistUserId
      : appointment.patientUserId;
  }, [appointment, session?.user?.id]);

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/messages/${appointmentId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Failed to load messages");
        }
        const data = await res.json();
        if (!isMounted) return;
        setMessages(data.messages || []);
        setAppointment(data.appointment || null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load messages");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [appointmentId]);

  useEffect(() => {
    if (!appointmentId) return;
    const socket = connectSocket();
    const room = `appointment:${appointmentId}`;

    socket.emit("join", room);

    const handleMessage = (message: MessageRecord) => {
      setMessages((prev) => {
        if (prev.some((item) => item.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    socket.on("message:new", handleMessage);
    socket.on(
      "presence:update",
      (payload: { room: string; onlineUserIds: string[] }) => {
        if (payload.room !== room) return;
        setIsOtherOnline(payload.onlineUserIds.includes(otherUserId));
      }
    );
    socket.on(
      "typing",
      (payload: { userId: string; isTyping: boolean }) => {
        if (payload.userId === otherUserId) {
          setIsOtherTyping(payload.isTyping);
        }
      }
    );

    return () => {
      socket.emit("leave", room);
      socket.off("message:new", handleMessage);
      socket.off("presence:update");
      socket.off("typing");
      disconnectSocket();
    };
  }, [appointmentId, otherUserId]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content && !pendingAttachment) return;
    setInput("");
    setIsOtherTyping(false);
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }
    if (isTypingRef.current) {
      const socket = connectSocket();
      socket.emit("typing:stop", `appointment:${appointmentId}`);
      isTypingRef.current = false;
    }

    const socket = connectSocket();
    socket.emit(
      "message:send",
      {
        appointmentId,
        content,
        attachment: pendingAttachment || undefined,
      },
      (response: any) => {
        if (response?.ok && response?.message) {
          setMessages((prev) => {
            if (prev.some((item) => item.id === response.message.id)) return prev;
            return [...prev, response.message];
          });
        }
      }
    );
    setPendingAttachment(null);
  };

  const handleAttachmentUpload = (file: any) => {
    if (!file?.url) return;
    setPendingAttachment({
      url: file.url,
      key: file.key,
      type: file.type,
      name: file.name,
    });
  };

  const renderAttachment = (message: MessageRecord) => {
    if (!message.attachmentUrl) return null;
    const isImage = message.attachmentType?.startsWith("image/");
    if (isImage) {
      return (
        <img
          src={message.attachmentUrl}
          alt={message.attachmentName || "Attachment"}
          className="mt-2 rounded-xl max-h-48 object-cover"
        />
      );
    }
    return (
      <a
        href={message.attachmentUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-2 text-xs underline"
      >
        <Paperclip size={12} />
        {message.attachmentName || "Attachment"}
      </a>
    );
  };

  const handleTyping = (value: string) => {
    setInput(value);
    const socket = connectSocket();
    if (!isTypingRef.current) {
      socket.emit("typing:start", `appointment:${appointmentId}`);
      isTypingRef.current = true;
    }
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing:stop", `appointment:${appointmentId}`);
      isTypingRef.current = false;
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-[24px] p-12 text-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-[24px] p-12 text-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E6EAF2] rounded-[24px] shadow-sm flex flex-col h-[70vh]">
      <div className="px-6 py-4 border-b border-[#E6EAF2]">
        <h2 className="text-lg font-semibold text-gray-900">{otherName}</h2>
        <p className="text-sm text-gray-500">
          {isOtherTyping
            ? "Typing..."
            : isOtherOnline
            ? "Online"
            : "Offline"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === session?.user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    isMine
                      ? "bg-[#5B6CFF] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {renderAttachment(message)}
                  <div
                    className={`mt-2 text-[11px] ${
                      isMine ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                    {isMine && (
                      <span className="ml-2">
                        {message.read ? "Seen" : "Sent"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-[#E6EAF2] p-4 flex flex-col gap-3">
        {pendingAttachment && (
          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600">
            <span>{pendingAttachment.name || "Attachment ready"}</span>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setPendingAttachment(null)}
            >
              Remove
            </button>
          </div>
        )}
        <div className="flex gap-3">
          <UploadButton
            endpoint="messageAttachment"
            appearance={{
              button:
                "h-11 w-11 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
              allowedContent: "hidden",
            }}
            content={{ button: <Paperclip size={16} /> }}
            onClientUploadComplete={(res) => handleAttachmentUpload(res?.[0])}
            onUploadError={(error) => setError(error.message)}
          />
        <Input
          value={input}
          onChange={(event) => handleTyping(event.target.value)}
          placeholder="Type your message..."
          className="rounded-full flex-1"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button
          type="button"
          className="rounded-full bg-[#5B6CFF] hover:bg-[#4a5ae0]"
          onClick={sendMessage}
        >
          <SendHorizontal size={16} />
        </Button>
        </div>
      </div>
    </div>
  );
}
