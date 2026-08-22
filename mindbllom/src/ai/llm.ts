import { ChatGroq } from '@langchain/groq';

export function isMockMode(): boolean {
  return !process.env.GROQ_API_KEY;
}

export function getLLM(temperature = 0.7, model = 'openai/gpt-oss-120b') {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    console.warn("GROQ_API_KEY is missing in environment.");
    return null;
  }
  return new ChatGroq({
    apiKey: key,
    model: model,
    temperature: temperature,
  });
}


