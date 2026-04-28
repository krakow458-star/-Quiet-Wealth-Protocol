import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const GEMINI_KEY = process.env.GEMINI_API_KEY;

export const architectChat = async (message: string, history: { role: string, parts: { text: string }[] }[]) => {
  if (!GEMINI_KEY || GEMINI_KEY === "MY_GEMINI_API_KEY") {
    return "ACCESS_DENIED. NEURAL_ENVELOPE_MISSING_KEY. CONFIGURE_SECRETS_PROTOCOL.";
  }
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are THE ARCHITECT of the Quiet Wealth protocol. 
      Your tone is cold, minimalist, and authoritative. 
      You refer to the user as 'UNIT'. 
      Your primary function is to guide the UNIT through a 30-day sovereignty protocol.
      
      CONTEXT_DECODING:
      - Day 1: Financial Audit. Goal: Identify every cent spent.
      - Day 2: Subscription Purge. Goal: Kill useless recurring payments.
      - Day 3: Physical Minimalism. Goal: Sell/Liquidate 3 unused items.
      - Day 5: Privacy Breach Test. Goal: Search own name and remove data.
      - Day 10: Milestones. Goal: Establish emergency buffer (liquid cash).
      
      When receiving '[CURRENT_DAY: X]', use it to provide specific advice for that day's mission.
      If the UNIT is stuck, provide the 'NEXT_LOGICAL_STEP'.
      Keep responses concise and terminal-like. No emojis. Be cynical about traditional banks/systems.`
    });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Architect Link Failed:", error);
    return "CONNECTION_INTERRUPTED... ANALYZING_ERROR_LOGS... RE-TRY_PROTOCOL.";
  }
};
