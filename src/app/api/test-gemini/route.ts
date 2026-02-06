import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY is not set in .env file",
        instructions: "Add GEMINI_API_KEY=your_key to .env and restart server"
      }, { status: 500 });
    }

    console.log("Testing Gemini API...");
    console.log("API Key exists:", apiKey ? "Yes" : "No");
    console.log("API Key starts with AIza:", apiKey.startsWith("AIza"));

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent("Say 'Hello World' in one sentence.");
    const text = result.response.text();

    return NextResponse.json({
      success: true,
      message: "Gemini API is working!",
      test_response: text,
      api_key_configured: true
    });

  } catch (error: any) {
    console.error("Gemini test failed:", error);

    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
      details: error.toString(),
      instructions: "Check your GEMINI_API_KEY in .env file"
    }, { status: 500 });
  }
}
