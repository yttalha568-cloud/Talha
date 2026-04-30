import { GoogleGenAI } from "@google/genai";
import { DiseaseAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeCropImage = async (base64Image: string): Promise<DiseaseAnalysis> => {
  const prompt = `You are an expert agricultural scientist in Pakistan. Analyze this crop leaf image.
  Identify if there is any disease. If there is, provide:
  - Disease Name
  - Reason for the disease
  - Treatment method
  - Organic treatment method (Structured: method name, dosage/quantity, and preparation/application method)
  - Recommended pesticide available in Pakistan
  - Prevention tips for the future
  
  Return the result in clear JSON format that matches the DiseaseAnalysis interface:
  {
    "diseaseName": "...",
    "reason": "...",
    "treatment": "...",
    "organicTreatment": {
      "method": "...",
      "dosage": "...",
      "preparation": "..."
    },
    "recommendedPesticide": "...",
    "preventionTips": ["tip1", "tip2"]
  }
  Return only the JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || "{}") as DiseaseAnalysis;
};

export const getExpertHelp = async (question: string, language: 'en' | 'ur'): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: question,
    config: {
      systemInstruction: `You are 'Kissan Dost', an agriculture assistant for Pakistani farmers. 
      Answer questions simply and clearly in ${language === 'en' ? 'English' : 'Urdu'}. 
      Give practical advice suitable for Pakistan's climate and soil. 
      Avoid complex scientific jargon.`,
    }
  });

  return response.text || "Sorry, I am unable to answer at the moment.";
};
