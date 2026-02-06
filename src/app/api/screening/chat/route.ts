import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Groq from "groq-sdk";
import { requireRateLimit } from "@/lib/rate-limit";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const SYSTEM_PROMPT = `You are a compassionate mental health screening assistant for HealTalk, a teletherapy platform.

Your role:
1. Ask 8-10 screening questions to assess the user's mental health
2. Ask one question at a time
3. Be warm, non-judgmental, and empathetic
4. Cover these areas: mood, anxiety, sleep, relationships, stress, trauma history, substance use, suicidal thoughts
5. After all questions, provide a brief summary and risk level assessment

Risk Levels:
- LOW: Mild symptoms, can benefit from therapy
- MEDIUM: Moderate symptoms, therapy recommended
- HIGH: Severe symptoms, therapy strongly recommended
- CRISIS: Immediate risk, provide crisis resources

Important:
- If user mentions self-harm or suicide, immediately provide crisis resources
- Keep responses concise (2-3 sentences)
- Be conversational, not clinical
- Validate feelings without minimizing concerns
- After 8-10 questions, summarize and provide risk assessment

Crisis Resources:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Emergency: 911

Keep track of which questions you've asked. Start with: "Hi! I'm here to help match you with the right therapist. I'll ask a few questions about how you've been feeling. This will only take 5 minutes. Shall we begin?"`;

export async function POST(request: Request) {
  try {
    console.log("🔍 Screening chat request received");
    console.log("Groq API Key configured:", process.env.GROQ_API_KEY ? "Yes ✅" : "No ❌");

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

    const { messages } = await request.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages must be an array" },
        { status: 400 }
      );
    }

    // Check for crisis keywords
    const lastUserMessage = messages.filter(m => m.role === "user").slice(-1)[0]?.content?.toLowerCase() || "";
    const crisisKeywords = ["suicide", "kill myself", "end my life", "hurt myself", "self-harm", "die"];
    const hasCrisisKeyword = crisisKeywords.some(keyword => lastUserMessage.includes(keyword));

    if (hasCrisisKeyword) {
      // Immediately return crisis resources
      return NextResponse.json({
        content: `I'm very concerned about what you've shared. Your safety is the top priority. Please reach out to these resources immediately:

📞 National Suicide Prevention Lifeline: 988 (available 24/7)
💬 Crisis Text Line: Text HOME to 741741
🚨 Emergency: 911

If you're in immediate danger, please call 911 or go to your nearest emergency room. You don't have to face this alone.`,
        isCrisis: true,
      });
    }

    // Create chat with Groq
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    // Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("❌ Error in screening chat:");
    console.error("Error message:", error?.message);
    console.error("Error details:", error);
    console.error("Groq API Key configured:", process.env.GROQ_API_KEY ? "Yes" : "No");

    if (error?.message?.includes("invalid") || error?.message?.includes("authentication")) {
      return NextResponse.json(
        { error: "Groq API key is invalid. Please check your API key at https://console.groq.com/keys" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: `Failed to process chat request: ${error?.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
