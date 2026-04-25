import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export const chatModel = genAI.getGenerativeModel({ 
  model: "gemini-3.1-flash-lite-preview",
  generationConfig: {
    temperature: 0,
    topP: 0.95,
  }
});
export const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

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

    If the user asks a factual question about a person, answer in plain text using the following structure:
    1. Start with a direct opening sentence acknowledging the records.
    2. Group the information into 2-3 logical categories (e.g., Technical Skills, Professional Experience, Leadership).
    3. For each category, use a bold title followed by a colon and a detailed explanation that cites specific projects or roles from the context as evidence.
    4. Maintain a professional, objective tone.

    If the user asks to find, recommend, or suggest people, follow the same structural rules for the summary, and importantly, end your response with the exact tag [SHOW_CARDS] so I know to display the profile cards.

    CONTEXT:
    ${context}

    USER QUESTION: ${prompt}
  `;

  const result = await chatModel.generateContent(fullPrompt);
  return result.response.text();
};
