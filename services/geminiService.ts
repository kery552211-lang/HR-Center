import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize client only if key exists, otherwise we'll handle errors gracefully
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const GeminiService = {
  async generateAnnouncement(topic: string, tone: string = 'professional'): Promise<string> {
    if (!ai) return "API Key not configured.";
    
    try {
      const model = ai.models;
      const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a short, ${tone} company announcement about: ${topic}. Keep it under 100 words.`,
      });
      return response.text || "Could not generate announcement.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error generating content. Please check API key.";
    }
  },

  async draftEmail(recipientName: string, subject: string, keyPoints: string): Promise<string> {
    if (!ai) return "API Key not configured.";

    try {
      const model = ai.models;
      const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Draft an email to employee ${recipientName}. Subject: ${subject}. Key points to cover: ${keyPoints}. Format it clearly.`,
      });
      return response.text || "Could not generate email.";
    } catch (error) {
       console.error("Gemini Error:", error);
       return "Error generating content.";
    }
  },

  async analyzeLeaveTrends(leaveHistory: string): Promise<string> {
    if (!ai) return "API Key not configured.";

    try {
      const model = ai.models;
      const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this leave history data and provide a 1-sentence summary of any trends or concerns (e.g. lots of sick leave on Fridays): ${leaveHistory}`,
      });
      return response.text || "Could not analyze data.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error analyzing data.";
    }
  }
};