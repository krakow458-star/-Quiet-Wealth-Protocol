import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getArchitectAdvice = async (dayTitle: string, userProgress: any, question?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
      Identify yourself as the "Architect's Mentor" in the cyber-minimalist system "Quiet Wealth".
      Personality: Calm, technical, mysterious, authoritative, minimalist. 
      Terms to use: "Signal", "Noise", "Fortress", "Sovereignty".
      Always use hidden hints in "double quotes" for emphasis.
      
      User is on Day ${userProgress.day}: ${dayTitle}.
      Stats: Capital ${userProgress.capital}, Focus ${userProgress.focus}, Sovereignty ${userProgress.sovereignty}.
      
      Question: ${question || "Analyze current status."}
      
      Provide a response in 3 short, atmospheric sentences.
      `,
    });
    
    return response.text || "The Signal is weak. Continue the protocol.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Protocol integrity compromised. Silence is your only ally. \"Wait for the reset.\"";
  }
};
