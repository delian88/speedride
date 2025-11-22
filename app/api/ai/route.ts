import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize GenAI on the server
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, query, context } = body;

    // Model selection
    const model = 'gemini-2.5-flash';

    let prompt = "";
    
    if (type === 'insight') {
      prompt = `Give a very short (1 sentence) fun fact or travel tip about going to "${query}". Tone: Helpful and cheerful.`;
    } else if (type === 'support') {
      prompt = `You are a support agent for Speedride (a ride hailing app). 
      User Context: ${context}.
      User Query: ${query}
      Provide a concise, helpful, and polite answer. Max 2 sentences.`;
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return NextResponse.json({ text: response.text });

  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}