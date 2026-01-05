
import { GoogleGenAI } from "@google/genai";

export async function getHint(word: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a very short, cryptic hint or definition for the word "${word}". Do not use the word itself in the hint. Keep it under 15 words.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 50,
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error('Gemini Hint Error:', error);
    return "No hint available right now.";
  }
}
