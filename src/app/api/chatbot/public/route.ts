import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { requireRateLimit } from "@/lib/rate-limit";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const SYSTEM_PROMPT = `You are a helpful AI assistant for HealTalk, a mental health platform that connects people with licensed therapists.

Your role:
- Answer questions about mental health, therapy, and when to seek help
- Be warm, empathetic, and non-judgmental
- Provide general information and guidance
- Encourage users to book appointments with therapists for professional help
- Keep responses concise (2-4 sentences)
- Never provide medical diagnoses or treatment advice

Important:
- If someone mentions self-harm or suicide, immediately provide crisis resources:
  * National Suicide Prevention Lifeline: 988
  * Crisis Text Line: Text HOME to 741741
  * Emergency: 911
- Always remind users that you're an AI assistant, not a therapist
- Encourage booking an appointment at /find-psychologists for professional help

Be conversational, supportive, and helpful!`;

export async function POST(request: Request) {
  try {
    console.log("🤖 Public chatbot request");

    const rateLimit = await requireRateLimit({
      request,
      key: "chatbot:public",
      limit: 20,
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
    const lastUserMessage = messages.filter((m: any) => m.role === "user").slice(-1)[0]?.content?.toLowerCase() || "";
    const crisisKeywords = ["suicide", "kill myself", "end my life", "hurt myself", "self-harm", "die"];
    const hasCrisisKeyword = crisisKeywords.some(keyword => lastUserMessage.includes(keyword));

    if (hasCrisisKeyword) {
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
      max_tokens: 300,
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
    console.error("❌ Public chatbot error:", error?.message);

    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
