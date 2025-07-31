import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Kiểm tra API key có tồn tại không
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY không được định nghĩa trong file .env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function main() {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const response = await model.generateContent("what is my Gemini API key?");
    console.log(response.response.text());
  } catch (error) {
    console.error("Lỗi khi gọi API:", error.message);
  }
}

main();