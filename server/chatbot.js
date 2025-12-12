import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key missing" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const userMessage = req.body.message;
    const result = await model.generateContent(userMessage);
    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Backend Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
