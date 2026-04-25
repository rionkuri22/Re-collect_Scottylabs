import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function getEmbedding(text: string) {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

// Note: text-embedding-004 output dimension can be adjusted, 
// but the SPEC says the index was created with 3072.
// gemini-embedding-001 with output_dimensionality=3072 was used in the notebook.
// I'll stick to what the notebook used if possible, or use text-embedding-004 if it supports 3072.
// In Next.js, we use the @google/generative-ai package.

export const getGeminiResponse = async (prompt: string, context: string) => {
  const fullPrompt = `
    You are Re:collect, a smart professional assistant.
    Use the following verified data about people in the CMU community to answer the user's question.
    If the answer isn't in the context, say you don't know based on the current records.
    Be concise but helpful.

    CONTEXT:
    ${context}

    USER QUESTION: ${prompt}
  `;

  const result = await chatModel.generateContent(fullPrompt);
  return result.response.text();
};
