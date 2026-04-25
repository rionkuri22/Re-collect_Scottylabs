import { NextRequest, NextResponse } from 'next/server';
import { index } from '@/lib/pinecone';
import { getGeminiResponse } from '@/lib/gemini';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // 1. Get embedding for the query
    const embedResult = await embeddingModel.embedContent({
        content: { parts: [{ text: message }] },
        taskType: "RETRIEVAL_QUERY",
        outputDimensionality: 3072
    });
    const queryVector = embedResult.embedding.values;

    // 2. Query Pinecone
    const queryResponse = await index.query({
      vector: queryVector,
      topK: 10,
      includeMetadata: true,
    });

    const context = queryResponse.matches
      ?.map((match) => match.metadata?.text)
      .filter(Boolean)
      .join('\n---\n') || '';

    // 3. Get Gemini response
    const answer = await getGeminiResponse(message, context);

    // 4. Extract recommended people from metadata if any
    const recommendedPeople = queryResponse.matches
      ?.map((match) => ({
        name: match.metadata?.owner,
        section: match.metadata?.section,
        text: match.metadata?.text
      }))
      .filter((person, index, self) => 
        person.name && self.findIndex(p => p.name === person.name) === index
      ) || [];

    return NextResponse.json({ answer, recommendedPeople });
  } catch (error: any) {
    console.error('Chat error:', error);
    if (error.message?.includes('quota')) {
        return NextResponse.json({ error: "API quota hit. Please try again later." }, { status: 429 });
    }
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
