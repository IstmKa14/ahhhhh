import { ChatGroq } from '@langchain/groq';

const apiKey = process.env.GROQ_API_KEY;

export const isMockMode = !apiKey;

export function getLLM(temperature = 0.7) {
  if (isMockMode) {
    console.warn("GROQ_API_KEY is missing, returning dummy client.");
    return null;
  }
  return new ChatGroq({
    apiKey: apiKey,
    model: 'llama-3.3-70b-versatile',
    temperature: temperature,
  });
}
