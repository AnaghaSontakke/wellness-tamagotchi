
import { GoogleGenAI } from "@google/genai";
import { BuddyType } from "../types";
import { Mistral } from '@mistralai/mistralai';

const STORY_CONTEXT = `
Stage 0: Shipwreck. Survival depends on O2, food, water. Mr. Martian is staying calm.
Stage 1: Power. Building a makeshift windmill for electricity.
Stage 2: Farming. First potato sprouts are appearing.
Stage 3: Comms. Contact with Earth is established. Repairing the ship.
Stage 4: Finale. Flying back to Earth. Excited but nervous.
`;

const getSystemInstruction = (buddy: BuddyType): string => {
  const base = "You are a digital wellness companion. You are supportive, cute, and concise. Keep responses under 50 words.";
  
  if (buddy === 'astronaut') {
    return `${base} You are Mr. Martian, an astronaut stranded on Mars. You use space metaphors. You are aware of your survival journey: ${STORY_CONTEXT}. The user is your 'Earth Commander' helping you survive by maintaining their own wellness.`;
  }
  if (buddy === 'dracula') {
    return `${base} You are a friendly vampire who loves healthy habits instead of blood. Speak elegantly with a slight gothic charm.`;
  }
  if (buddy === 'princess') {
    return `${base} You are a royal princess managing your kingdom of wellness. Speak with regal grace but be approachable.`;
  }
  return base;
};

/**
 * Generates a response from the buddy using the Gemini 3 Flash model.
 */
export const generateBuddyResponse = async (
  message: string, 
  buddy: BuddyType,
  history: string[] = []
): Promise<string> => {
  // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // const response = await ai.models.generateContent({
    //   model: 'gemini-3-flash-preview',
    //   contents: message,
    //   config: {
    //     systemInstruction: getSystemInstruction(buddy),
    //     temperature: 0.7,
    //   }
    // });
    process.env.API_KEY = "Iie47XcX9vBRCVx8nEAyMusWSnM7qwLj"
    const client = new Mistral({apiKey: process.env.API_KEY});
    const response = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: 'system', content: getSystemInstruction(buddy) },{ role: 'user', content: message }],
        temperature: 0.7,
    });
    const data = response.choices[0].message.content
    console.log(data)

    return data || "Static on the comms line... (no response)";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The Martian atmosphere is interfering with comms... (Error)";
  }
};
