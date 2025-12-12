import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GOOGLE_API_KEY) {
  console.error("Missing GOOGLE_API_KEY in .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

app.post("/api/chat", async (req, res) => {
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

    const reply = response.text;

    console.log("SruNova:", reply);
    res.json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error.message || error);
    res.status(500).json({ error: "AI response failed. Check server logs." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` SruNova backend live at http://localhost:${PORT}`);
});
