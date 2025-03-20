require("dotenv").config(); 
const readline = require("readline");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    console.error("❌ API key is missing! Set it in .env file.");
    process.exit(1);
}

async function chatbot() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("🤖 Lexi (Type 'exit' to stop)");

    async function askQuestion() {
        rl.question("You: ", async (userInput) => {
            if (userInput.toLowerCase() === "exit") {
                console.log(": Goodbye! 👋");
                rl.close();
                return;
            }

            try {
                const result = await model.generateContent(userInput);
                console.log("Lexi:", result.response.text());
            } catch (error) {
                console.error("⚠️ Error:", error);
            }

            askQuestion();
        });
    }

    askQuestion();
}

chatbot();
