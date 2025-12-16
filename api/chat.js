import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ error: "API key missing" });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: "Message required" });
    }

    console.log("User:", message);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    const reply = response.text; // Fixed for new SDK

    console.log("SruNova:", reply);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error.message || error);
    res.status(500).json({ error: "AI response failed" });
  }
}
