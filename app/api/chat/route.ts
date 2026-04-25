import { NextRequest, NextResponse } from 'next/server';
import { index } from '@/lib/pinecone';
import { getGeminiResponse } from '@/lib/gemini';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

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
    let answer = await getGeminiResponse(message, context);

    // 4. Decide whether to show cards based on the AI's tag
    const shouldShowCards = answer.includes("[SHOW_CARDS]");
    answer = answer.replace("[SHOW_CARDS]", "").trim();

    // 5. Build unique people cards
    let recommendedPeople: any[] = [];
    
    if (shouldShowCards) {
      const peopleMap = new Map<string, { name: string; sections: string[]; texts: string[]; source: string }>();

      for (const match of queryResponse.matches || []) {
        const owner   = match.metadata?.owner as string | undefined;
        const section = match.metadata?.section as string | undefined;
        const text    = match.metadata?.text as string | undefined;
        const source  = match.metadata?.source as string | undefined;
        if (!owner) continue;
        if (!peopleMap.has(owner)) {
          peopleMap.set(owner, { name: owner, sections: [], texts: [], source: source || '' });
        }
        const entry = peopleMap.get(owner)!;
        if (section && !entry.sections.includes(section)) entry.sections.push(section);
        if (text)    entry.texts.push(text);
      }

      recommendedPeople = Array.from(peopleMap.values()).map(p => ({
        name:     p.name,
        sections: p.sections,
        texts:    p.texts,
        source:   p.source,
      }));
    }

    return NextResponse.json({ answer, recommendedPeople });
  } catch (error: any) {
    console.error('Chat error:', error);
    if (error.message?.includes('quota')) {
        return NextResponse.json({ error: "API quota hit. Please try again later." }, { status: 429 });
    }
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
