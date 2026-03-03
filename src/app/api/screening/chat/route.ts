import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Groq from "groq-sdk";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { requireRateLimit } from "@/lib/rate-limit";
import { validateCsrf } from "@/lib/csrf";
import { parseJson } from "@/lib/validation";
import { CRISIS_KEYWORDS, EMERGENCY_NUMBERS } from "@/lib/constants";

const SYSTEM_PROMPT = `You are HealTalk AI, a supportive mental health assistant.

Rules:
1. Use simple and warm English.
2. Ask one short follow-up question at a time.
3. Give practical coping ideas (breathing, grounding, sleep routine, journaling, gentle planning).
4. Do NOT diagnose medical conditions and do NOT prescribe medication.
5. Keep responses short (3-6 lines).
6. Validate feelings without judgement.

Safety:
- If the user mentions self-harm, suicide, or immediate danger, stop normal chat.
- Tell the user to contact crisis resources immediately.
- Include:
  - National Suicide Prevention Lifeline: ${EMERGENCY_NUMBERS.crisis}
  - Crisis Text Line: Text HOME to ${EMERGENCY_NUMBERS.text}
  - Emergency: ${EMERGENCY_NUMBERS.emergency}

Opening style:
- Be conversational and calm.
- End each response with one gentle next-step question.`;

const chatPayloadSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(80),
});

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const DEFAULT_OPENROUTER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-2-9b-it:free",
];

const detectCrisisInMessage = (text: string): boolean => {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword));
};

const buildCrisisResponse = (): NextResponse => {
  const message = `I'm really glad you told me this. Your safety comes first.

Please contact support right now:
- National Suicide Prevention Lifeline: ${EMERGENCY_NUMBERS.crisis}
- Crisis Text Line: Text HOME to ${EMERGENCY_NUMBERS.text}
- Emergency: ${EMERGENCY_NUMBERS.emergency}

If you are in immediate danger, call ${EMERGENCY_NUMBERS.emergency} now or go to the nearest emergency room.`;

  return NextResponse.json({ content: message, isCrisis: true });
};

const uniqueModels = (models: Array<string | undefined>): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const model of models) {
    const value = model?.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }

  return result;
};

const getAssistantText = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") return null;
  const parsed = payload as {
    choices?: Array<{
      message?: {
        content?: string | Array<{ type?: string; text?: string }>;
      };
    }>;
  };

  const content = parsed.choices?.[0]?.message?.content;
  if (typeof content === "string" && content.trim()) return content;

  if (Array.isArray(content)) {
    const joined = content
      .map((item) => (item?.type === "text" ? item.text || "" : ""))
      .join("")
      .trim();
    return joined || null;
  }

  return null;
};

const buildLocalSupportResponse = (userMessage: string): string => {
  const text = userMessage.toLowerCase();
  let tips = `Try this now:
1) Breathe in for 4 seconds and out for 6 seconds for 1 minute.
2) Name 3 things you can see, 2 you can feel, and 1 you can hear.
3) Pick one small next step for today (5-10 minutes only).`;

  if (text.includes("sleep") || text.includes("insomnia")) {
    tips = `Sleep support steps:
1) Stop caffeine for the rest of today.
2) Keep lights low 1 hour before bed.
3) If your mind is busy, write a short worry list and one action for tomorrow.`;
  } else if (
    text.includes("anxious") ||
    text.includes("anxiety") ||
    text.includes("panic")
  ) {
    tips = `Anxiety support steps:
1) Put both feet on the floor and relax your shoulders.
2) Do slow breathing (in 4 sec, out 6 sec) for 2 minutes.
3) Say: "I am safe right now, this feeling will pass."`;
  } else if (text.includes("sad") || text.includes("depressed")) {
    tips = `Low mood support steps:
1) Drink water and take a short walk (5-10 minutes).
2) Send one message to someone you trust.
3) Do one tiny task to create momentum.`;
  }

  return `Thank you for sharing that. I am here with you.

${tips}

If you want, tell me what feels hardest right now, and I will help you with one step at a time.`;
};

const openRouterChat = async (options: {
  apiKey: string;
  baseUrl: string;
  model: string;
  messages: ChatMessage[];
}) => {
  const response = await fetch(`${options.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        process.env.APP_URL?.trim() ||
        "http://localhost:3000",
      "X-Title": "HealTalk AI",
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: 0.6,
      max_tokens: 500,
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMessage =
      (payload as { error?: { message?: string } | string } | null)?.error;
    const message =
      typeof errorMessage === "string"
        ? errorMessage
        : errorMessage?.message || "OpenRouter request failed";
    throw new Error(message);
  }

  const text = getAssistantText(payload);
  if (!text) {
    throw new Error("OpenRouter returned an empty response");
  }
  return text;
};

const groqChat = async (options: {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
}) => {
  const groq = new Groq({ apiKey: options.apiKey });
  const completion = await groq.chat.completions.create({
    model: options.model,
    messages: options.messages,
    temperature: 0.6,
    max_tokens: 500,
    stream: false,
  });

  const content: unknown = completion.choices?.[0]?.message?.content;
  let text = "";

  if (typeof content === "string") {
    text = content.trim();
  } else if (Array.isArray(content)) {
    text = content
      .map((part) => {
        if (!part || typeof part !== "object") return "";
        const typed = part as { type?: string; text?: string };
        return typed.type === "text" ? typed.text || "" : "";
      })
      .join("")
      .trim();
  }

  if (!text) {
    throw new Error("Groq returned an empty response");
  }

  return text;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await requireRateLimit({
      request,
      key: "screening:chat",
      limit: 10,
      window: "1 m",
    });
    if (rateLimit) return rateLimit;

    const csrfError = validateCsrf(request);
    if (csrfError) return csrfError;

    const { data, error } = await parseJson(request, chatPayloadSchema);
    if (error) return error;

    const openRouterApiKey = process.env.OPENROUTER_API_KEY?.trim();
    const groqApiKey = process.env.GROQ_API_KEY?.trim();

    const openRouterBaseUrl =
      process.env.OPENROUTER_BASE_URL?.trim() ||
      "https://openrouter.ai/api/v1";
    const primaryModel =
      process.env.OPENROUTER_MODEL?.trim() ||
      "meta-llama/llama-3.3-70b-instruct:free";
    const fallbackModel =
      process.env.OPENROUTER_FALLBACK_MODEL?.trim() ||
      "meta-llama/llama-3.1-8b-instruct:free";
    const groqModel =
      process.env.GROQ_MODEL?.trim() || "llama-3.1-8b-instant";

    const lastUserMessage =
      data.messages.filter((m) => m.role === "user").slice(-1)[0]?.content ?? "";

    if (detectCrisisInMessage(lastUserMessage)) {
      return buildCrisisResponse();
    }

    const modelMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...data.messages,
    ];

    const errors: string[] = [];
    let assistantText: string | null = null;

    if (openRouterApiKey) {
      const modelsToTry = uniqueModels([
        primaryModel,
        fallbackModel,
        ...DEFAULT_OPENROUTER_MODELS,
      ]);

      for (const model of modelsToTry) {
        try {
          assistantText = await openRouterChat({
            apiKey: openRouterApiKey,
            baseUrl: openRouterBaseUrl,
            model,
            messages: modelMessages,
          });
          break;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          errors.push(`OpenRouter(${model}): ${message}`);
        }
      }
    }

    if (!assistantText && groqApiKey) {
      try {
        assistantText = await groqChat({
          apiKey: groqApiKey,
          model: groqModel,
          messages: modelMessages,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errors.push(`Groq(${groqModel}): ${message}`);
      }
    }

    if (!assistantText) {
      if (!openRouterApiKey && !groqApiKey) {
        return NextResponse.json(
          { error: "AI service is not configured" },
          { status: 500 }
        );
      }

      if (errors.length > 0) {
        console.error("Screening chat provider errors:", errors.join(" | "));
      }
      assistantText = buildLocalSupportResponse(lastUserMessage);
    }

    return new Response(assistantText, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Screening chat error:", message);
    return NextResponse.json(
      { error: "Failed to process AI chat request" },
      { status: 500 }
    );
  }
}
