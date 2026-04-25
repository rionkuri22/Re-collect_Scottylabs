import { NextRequest, NextResponse } from 'next/server';
import { index } from '@/lib/pinecone';
import { GoogleGenerativeAI } from "@google/generative-ai";

import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

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
  const peopleMap = new Map<string, any>();

  for (const match of matches) {
    const owner    = match.metadata?.owner as string | undefined;
    const section  = match.metadata?.section as string | undefined;
    const text     = match.metadata?.text as string | undefined;
    const source   = match.metadata?.source as string | undefined;
    const subtitle = match.metadata?.subtitle as string | undefined;
    const summary  = match.metadata?.summary as string | undefined;

    const li_url   = match.metadata?.linkedin_url as string | undefined;
    const gh_url   = match.metadata?.github_url as string | undefined;

    if (!owner) continue;

    if (!peopleMap.has(owner)) {
      peopleMap.set(owner, { 
        name: owner, 
        sections: [], 
        texts: [], 
        source: source || '' 
      });
    }

    const entry = peopleMap.get(owner)!;
    
    // Collect URLs
    if (li_url && li_url !== "LinkedIn Profile") entry.linkedin_url = li_url;
    if (gh_url && gh_url !== "GitHub Profile")   entry.github_url   = gh_url;

    if (source === 'card_info') {
      if (subtitle) entry.subtitle = subtitle;
      if (summary)  entry.summary  = summary;
    } else {
      if (section && !entry.sections.includes(section)) entry.sections.push(section);
      if (text) entry.texts.push(text);
    }
  }

  return Array.from(peopleMap.values()).map(p => ({
    name:         p.name,
    sections:     p.sections,
    texts:        p.texts,
    source:       p.source,
    subtitle:     p.subtitle,
    summary:      p.summary,
    linkedin_url: p.linkedin_url,
    github_url:   p.github_url,
  })).sort((a, b) => a.name.localeCompare(b.name));
}
