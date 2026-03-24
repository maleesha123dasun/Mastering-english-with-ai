import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function suggestExample(phrase: string, category: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest a meaning and an example sentence for the following ${category}: "${phrase}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          meaning: { type: Type.STRING },
          example: { type: Type.STRING }
        },
        required: ["meaning", "example"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateMoreExamples(category: string, count: number = 20, existingPhrases: string[] = []) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${count} unique examples for the category "${category}". 
    Each example should have a 'phrase', 'meaning', and 'example' sentence.
    Avoid these existing phrases: ${existingPhrases.join(', ')}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            phrase: { type: Type.STRING },
            meaning: { type: Type.STRING },
            example: { type: Type.STRING }
          },
          required: ["phrase", "meaning", "example"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}
