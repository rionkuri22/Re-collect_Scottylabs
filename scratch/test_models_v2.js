const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const GOOGLE_API_KEY = env.match(/GOOGLE_API_KEY=(.*)/)?.[1];

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

async function testModels() {
  const models = ["gemini-3.1-flash-lite-preview", "gemini-1.5-flash", "gemini-embedding-001"];
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      if (m.includes("embedding")) {
        await model.embedContent("test");
      } else {
        await model.generateContent("Hi");
      }
      console.log(`Model ${m} works!`);
    } catch (e) {
      console.log(`Model ${m} failed: ${e.message}`);
    }
  }
}

testModels();
