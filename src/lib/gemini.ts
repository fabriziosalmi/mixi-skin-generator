import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSkin(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert UI/UX designer for a professional DJ software called Mixi. 
Generate a color palette and metadata for a new skin based on the user's description.
The UI uses a dark mode by default, so background colors should generally be dark, and deck/waveform colors should be vibrant to stand out.

User description: "${prompt}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metadata: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "A catchy name for the skin" },
              description: { type: Type.STRING, description: "A short description of the visual style" },
            },
            required: ["name", "description"],
          },
          colors: {
            type: Type.OBJECT,
            properties: {
              bgApp: { type: Type.STRING, description: "App background (hex)" },
              srfLow: { type: Type.STRING, description: "Low surface background (hex)" },
              srfMid: { type: Type.STRING, description: "Mid surface background (hex)" },
              srfRaised: { type: Type.STRING, description: "Raised surface background (hex)" },
              clrA: { type: Type.STRING, description: "Deck A primary color (hex)" },
              clrB: { type: Type.STRING, description: "Deck B primary color (hex)" },
              clrC: { type: Type.STRING, description: "Deck C primary color (hex)" },
              clrD: { type: Type.STRING, description: "Deck D primary color (hex)" },
              txtWhite: { type: Type.STRING, description: "Primary text color (hex)" },
              txtMuted: { type: Type.STRING, description: "Muted text color (hex)" },
              brdDefault: { type: Type.STRING, description: "Default border color (hex)" },
              waveLow: { type: Type.STRING, description: "Waveform low frequencies color (hex)" },
              waveMid: { type: Type.STRING, description: "Waveform mid frequencies color (hex)" },
              waveHigh: { type: Type.STRING, description: "Waveform high frequencies color (hex)" },
              waveBg: { type: Type.STRING, description: "Waveform background color (hex)" },
              wavePlayhead: { type: Type.STRING, description: "Waveform playhead color (hex)" },
            },
            required: [
              "bgApp", "srfLow", "srfMid", "srfRaised", 
              "clrA", "clrB", "clrC", "clrD", 
              "txtWhite", "txtMuted", "brdDefault", 
              "waveLow", "waveMid", "waveHigh", "waveBg", "wavePlayhead"
            ],
          }
        },
        required: ["metadata", "colors"],
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text);
}
