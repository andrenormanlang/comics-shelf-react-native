import { GoogleGenerativeAI } from "@google/genai";

const GEMINI_API_KEY = "AIzaSyAcc28W8uTKKspPxXsDsx9hFT31HoF1nVI";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateComicDescription = async (title, status, rating) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-preview-03-25",
    });

    const prompt = `Generate a brief, engaging description for a comic book with the following details:
    Title: ${title}
    Reading Status: ${status}
    ${rating > 0 ? `Rating: ${rating}/5` : ""}
    
    Please focus on making it sound interesting and inviting. Keep it under 250 characters.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating description:", error);
    return null;
  }
};

export default {
  generateComicDescription,
};
