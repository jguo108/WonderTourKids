import { GoogleGenAI, Type } from "@google/genai";
import { LandmarkData } from '../types';

export const fetchLandmarkDetails = async (landmarkName: string): Promise<LandmarkData> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are an enthusiastic, fun, and educational tour guide for a 10-year-old kid.
      The user is looking at a landmark identified as "${landmarkName}".
      
      Please provide details about this landmark in a way that is easy to read, engaging, and perfect for a 4th grader.
      Avoid complex jargon. Use emojis occasionally to make it fun.
      
      Return a JSON object with the following fields:
      - name: The proper name of the landmark (fix capitalization or formatting if needed from the raw input "${landmarkName}").
      - history: A short, interesting story about how/when it was built. Max 3 sentences.
      - funFacts: An array of 3 super cool, surprising facts.
      - architecture: Describe what it looks like and its style in simple terms (e.g., "It's shaped like a giant triangle!").
      - visitInfo: Practical tips for visiting (e.g., "Best time to go", "Look for the secret door", etc.).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            history: { type: Type.STRING },
            funFacts: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            architecture: { type: Type.STRING },
            visitInfo: { type: Type.STRING },
          },
          required: ["name", "history", "funFacts", "architecture", "visitInfo"],
        }
      }
    });

    if (!response.text) {
      throw new Error("No data returned from AI");
    }

    const data = JSON.parse(response.text) as LandmarkData;
    return data;

  } catch (error) {
    console.error("Error fetching landmark details:", error);
    // Return fallback data if API fails
    return {
      name: landmarkName,
      history: "We couldn't load the history right now, but it looks amazing!",
      funFacts: ["It's a mystery!", "Try again later to learn more.", "Ask a grown-up!"],
      architecture: "It looks very cool!",
      visitInfo: "Check local maps for info."
    };
  }
};
