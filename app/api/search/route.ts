import { NextRequest, NextResponse } from 'next/server';
import { index } from '@/lib/pinecone';
import { GoogleGenerativeAI } from "@google/generative-ai";

import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      // Fetch all people from test_data JSONs
      const testDataDir = path.join(process.cwd(), 'test_data');
      const files = fs.readdirSync(testDataDir);
      const people = files
        .filter(f => f.endsWith('.json'))
        .map(f => {
          const content = JSON.parse(fs.readFileSync(path.join(testDataDir, f), 'utf-8'));
          const personalInfo = content.personal_info?.find((p: any) => p.name) || content.personal_info?.[0];
          return {
            name: personalInfo?.name || f.replace('_resume.json', '').replace('_', ' '),
            source: 'test_data',
            text: content.raw_extracted_text?.[0]?.value?.substring(0, 200) + '...'
          };
        });
      
      return NextResponse.json(people.sort((a, b) => a.name.localeCompare(b.name)));
    }

    // 1. Get embedding for the query
    const embedResult = await embeddingModel.embedContent({
        content: { parts: [{ text: query }] },
        taskType: "RETRIEVAL_QUERY",
        outputDimensionality: 3072
    });
    const queryVector = embedResult.embedding.values;

    // 2. Query Pinecone
    const queryResponse = await index.query({
      vector: queryVector,
      topK: 20,
      includeMetadata: true,
    });

    return NextResponse.json(processMatches(queryResponse.matches || []));
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: "Failed to perform search." }, { status: 500 });
  }
}

function processMatches(matches: any[]) {
    const peopleMap = new Map();
    
    matches.forEach(match => {
        const owner = match.metadata?.owner;
        if (owner && !peopleMap.has(owner)) {
            peopleMap.set(owner, {
                name: owner,
                metadata: match.metadata
            });
        }
    });

    return Array.from(peopleMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}
