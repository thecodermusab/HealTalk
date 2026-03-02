"use client";

import { fetchCsrfToken } from "@/lib/client-security";

type StartConversationOptions = {
  psychologistId: string;
  content?: string;
};

type StartConversationResult =
  | { ok: true; conversationId: string }
  | { ok: false; error: string; shouldLogin?: boolean };

export const startTherapistConversation = async ({
  psychologistId,
  content,
}: StartConversationOptions): Promise<StartConversationResult> => {
  const csrfToken = await fetchCsrfToken();
  if (!csrfToken) {
    return { ok: false, error: "Unable to start chat right now. Please refresh and try again." };
  }

  const response = await fetch("/api/messages/start", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken,
    },
    body: JSON.stringify({
      psychologistId,
      content: content?.trim() || undefined,
    }),
  });

  if (response.status === 401) {
    return { ok: false, error: "Please sign in first.", shouldLogin: true };
  }

  const payload = (await response.json().catch(() => null)) as
    | { conversationId?: string; error?: string }
    | null;

  if (!response.ok || !payload?.conversationId) {
    return {
      ok: false,
      error: payload?.error || "Could not start the conversation.",
    };
  }

  return { ok: true, conversationId: payload.conversationId };
};
