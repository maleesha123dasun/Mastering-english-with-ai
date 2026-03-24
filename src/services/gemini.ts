import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const generateSpeech = async (text: string) => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
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
    // Gemini TTS returns raw PCM data at 24kHz. We need to wrap it in a WAV header.
    // Use standard Web APIs for browser compatibility
    const binaryString = atob(base64Audio);
    const pcmData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      pcmData[i] = binaryString.charCodeAt(i);
    }

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    // RIFF identifier
    view.setUint32(0, 0x52494646, false); // "RIFF"
    // file length
    view.setUint32(4, 36 + pcmData.length, true);
    // RIFF type
    view.setUint32(8, 0x57415645, false); // "WAVE"
    // format chunk identifier
    view.setUint32(12, 0x666d7420, false); // "fmt "
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (1 is PCM)
    view.setUint16(20, 1, true);
    // channel count (1 for mono)
    view.setUint16(22, 1, true);
    // sample rate (24000 for Gemini TTS)
    view.setUint32(24, 24000, true);
    // byte rate (sampleRate * channelCount * bitsPerSample/8)
    view.setUint32(28, 24000 * 2, true);
    // block align (channelCount * bitsPerSample/8)
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    view.setUint32(36, 0x64617461, false); // "data"
    // data chunk length
    view.setUint32(40, pcmData.length, true);

    const fullWav = new Uint8Array(44 + pcmData.length);
    fullWav.set(new Uint8Array(wavHeader), 0);
    fullWav.set(pcmData, 44);

    // Convert to base64 using a safer method for large arrays
    let binary = '';
    const bytes = new Uint8Array(fullWav);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64Wav = btoa(binary);

    return `data:audio/wav;base64,${base64Wav}`;
  }
  throw new Error("Failed to generate speech");
};

export const getGeminiResponse = async (prompt: string, systemInstruction?: string) => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || "You are a helpful English teacher named EnglishMaster AI.",
    },
  });

  return response.text;
};

export const correctGrammar = async (text: string) => {
  const prompt = `Please correct the grammar of the following English text. Provide the corrected version and a brief explanation of the changes: "${text}"`;
  const systemInstruction = "You are an expert English grammar corrector. Return your response in JSON format with 'correctedText' and 'explanation' fields.";
  
  const ai = new GoogleGenAI({ apiKey: apiKey! });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
};

export const suggestVocabulary = async (topic: string) => {
  const prompt = `Suggest 5 advanced vocabulary words related to the topic: "${topic}". For each word, provide a definition and an example sentence.`;
  const systemInstruction = "You are a vocabulary expert. Return your response in JSON format as an array of objects with 'word', 'definition', and 'example' fields.";
  
  const ai = new GoogleGenAI({ apiKey: apiKey! });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
};

export const translateText = async (text: string, sourceLang: string, targetLang: string) => {
  const prompt = `Translate the following text from ${sourceLang} to ${targetLang}: "${text}". Only provide the translated text.`;
  const systemInstruction = `You are a professional translator. Translate accurately between English and Sinhala.`;
  
  const ai = new GoogleGenAI({ apiKey: apiKey! });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { systemInstruction },
  });

  return response.text;
};

export const dictionaryLookup = async (word: string) => {
  const prompt = `Provide a comprehensive dictionary entry for the word "${word}" in the style of the Cambridge Dictionary. Include:
  1. Phonetic transcription.
  2. Word class (noun, verb, etc.).
  3. Sinhala meaning.
  4. Multiple definitions/uses.
  5. At least 2 example sentences for each use.
  6. Synonyms and Antonyms.`;
  
  const systemInstruction = "You are an expert lexicographer. Return your response in JSON format with fields: 'word', 'phonetic', 'class', 'sinhalaMeaning', 'entries' (an array of objects with 'definition', 'sinhalaDefinition', 'examples' (array of strings)), 'synonyms' (array), 'antonyms' (array).";
  
  const ai = new GoogleGenAI({ apiKey: apiKey! });
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
};

export const autoFillVocabulary = async (word: string) => {
  const prompt = `Provide detailed information for the English word "${word}" to be added to a personal vocabulary list. Include:
  1. Sinhala meaning.
  2. All common uses.
  3. At least 2 examples for each use.`;
  
  const systemInstruction = "You are a language learning assistant. Return your response in JSON format with fields: 'sinhalaMeaning', 'uses' (an array of objects with 'useType', 'sinhalaUseType', 'examples' (array of strings))).";
  
  const ai = new GoogleGenAI({ apiKey: apiKey! });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
};
