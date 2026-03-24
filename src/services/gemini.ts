import { GoogleGenAI, Modality } from "@google/genai";

// 1. Corrected: Use VITE_ and import.meta.env for Netlify/Vite compatibility
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const generateSpeech = async (text: string) => {
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash", // Using stable model for TTS
    contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    const binaryString = atob(base64Audio);
    const pcmData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      pcmData[i] = binaryString.charCodeAt(i);
    }

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + pcmData.length, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 24000, true);
    view.setUint32(28, 24000 * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, pcmData.length, true);

    const fullWav = new Uint8Array(44 + pcmData.length);
    fullWav.set(new Uint8Array(wavHeader), 0);
    fullWav.set(pcmData, 44);

    let binary = '';
    const bytes = new Uint8Array(fullWav);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return `data:audio/wav;base64,${btoa(binary)}`;
  }
  throw new Error("Failed to generate speech");
};

export const getGeminiResponse = async (prompt: string, systemInstruction?: string) => {
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    // 2. Fixed: removed the double "model: model:" typo
    model: "gemini-1.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || "You are a helpful English teacher.",
    },
  });

  return response.text;
};

// ... apply the same model: "gemini-1.5-flash" to all other functions below
