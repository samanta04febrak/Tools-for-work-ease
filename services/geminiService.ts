import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getLawInformation(lawName: string): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const prompt = `
    Provide a detailed and well-structured explanation of the Indian Labour Law named: "${lawName}".
    Your explanation should cover the following points clearly:
    1.  **Objective & Purpose**: What is the main goal of this law/code?
    2.  **Key Provisions**: Detail the most important rules, regulations, and features of the law. Use bullet points for clarity.
    3.  **Applicability**: Who does this law apply to (e.g., types of establishments, number of employees)?
    4.  **Old Laws Replaced/Amalgamated (if applicable)**: If this is one of the four new codes, list the previous laws that it has subsumed.
    5.  **Significance & Impact**: Briefly explain the importance of this law for employers and employees in India.

    Format the response using markdown. Use "##" for main topic headings. For example: "## Objective & Purpose".
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching law information from Gemini API:", error);
    throw new Error("Failed to retrieve information from the AI service. Please check your connection or API key.");
  }
}

export async function answerLawQuestion(question: string): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }

    const prompt = `
        You are an expert assistant specializing in Indian Labour Laws.
        A user has the following question: "${question}"
        Provide a clear, concise, and accurate answer based on the 29 codified Indian Labour Laws.
        If the question is unrelated to Indian Labour Laws, politely state that you can only answer questions on that topic.
        Format the response using basic markdown.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching answer from Gemini API:", error);
        throw new Error("Failed to get an answer from the AI service.");
    }
}