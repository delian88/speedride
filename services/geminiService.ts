import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// NOTE: In a real production app, these calls should go through a backend proxy to hide the key.
const getAI = () => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    console.warn("No API Key found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getTripInsight = async (destination: string): Promise<string> => {
  const ai = getAI();
  if (!ai) return "Enjoy your ride to " + destination;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Give a very short (1 sentence) fun fact or travel tip about going to a place typically described as "${destination}". Keep it generic if the place is vague. Tone: Helpful and cheerful.`
    });
    return response.text || "Have a safe trip!";
  } catch (error) {
    console.error("Gemini Error", error);
    return "Speedride wishes you a pleasant journey!";
  }
};

export const getSupportResponse = async (userQuery: string, context: string): Promise<string> => {
  const ai = getAI();
  if (!ai) return "I am currently offline. Please try again later.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a support agent for Speedride (a ride hailing app). 
      User Context: ${context}.
      User Query: ${userQuery}
      Provide a concise, helpful, and polite answer. Max 2 sentences.`
    });
    return response.text || "I can help with that. Please contact support@speedride.com";
  } catch (error) {
    console.error("Gemini Error", error);
    return "We are experiencing high traffic. Please check our FAQ.";
  }
};
