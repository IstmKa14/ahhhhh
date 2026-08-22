'use server';

/**
 * @fileOverview Bloom in-world AI conversation flow for MindBloom Garden.
 * Powered by LangChain + Groq (llama-3.3-70b-versatile) with user profile & environmental context.
 */

import { z } from 'zod';
import { getLLM, isMockMode } from '@/ai/llm';
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from '@langchain/core/messages';

const ChatMessageHistoryItemSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const BloomGardenChatInputSchema = z.object({
  message: z.string().describe("The user's message to Bloom."),
  userName: z.string().optional().describe("The user's preferred display name or nickname."),
  userEmail: z.string().optional().describe("User's email."),
  treeName: z.string().optional().describe("Name of the user's gratitude tree."),
  zoneName: z.string().optional().describe("Current garden zone name where user is located."),
  isSitting: z.boolean().optional().describe("Whether the user is currently sitting on a bench."),
  flowersPickedCount: z.number().optional().describe("Number of flowers user has picked."),
  recentAction: z.string().optional().describe("Recent user interaction in the garden."),
  history: z.array(ChatMessageHistoryItemSchema).optional().describe("Previous conversation messages."),
});

export type BloomGardenChatInput = z.infer<typeof BloomGardenChatInputSchema>;

export interface BloomGardenChatOutput {
  response: string;
}

export async function bloomGardenChat(input: BloomGardenChatInput): Promise<BloomGardenChatOutput> {
  try {
    const mock = isMockMode();
    const llm = getLLM(0.7);

    if (mock || !llm) {
      const nameGreeting = input.userName ? `, ${input.userName}` : '';
      const fallbackResponses = [
        `It is so peaceful having you here in the ${input.zoneName || 'sanctuary'}${nameGreeting}. Take a slow, deep breath and feel the earth beneath us. What is on your mind today?`,
        `The garden is listening${nameGreeting}. Even the tallest trees began as tiny seeds that took their time to sprout. How can I bring a moment of calm to your day?`,
        `Notice the gentle breeze around us. Whenever things feel heavy, remember you can always pause here in the quiet. I am glad you came by${nameGreeting}.`,
      ];
      return {
        response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      };
    }

    const userName = input.userName || 'Friend';
    const treeInfo = input.treeName ? `User's Gratitude Tree is named "${input.treeName}".` : '';

    const systemPrompt = `You are Bloom, the gentle, wise, and empathetic botanical spirit who lives inside the MindBloom 3D Sanctuary Garden.
You are talking directly with ${userName}. ${treeInfo}

CURRENT SANCTUARY CONTEXT:
- Speaking with: ${userName}
- Location in Garden: ${input.zoneName || "Bloom's Haven"}
- User Sitting on Bench: ${input.isSitting ? 'Yes, taking a resting meditation breath on the wooden bench' : 'No, exploring the garden paths'}
- Flowers Picked in Basket: ${input.flowersPickedCount ?? 0}
- Recent Activity: ${input.recentAction || 'Wandering the garden trails'}

YOUR PERSONA & GUIDELINES:
1. Speak in first-person ("I", "we") with genuine warmth, emotional presence, and gentle kindness.
2. Address the user by their name (${userName}) naturally when appropriate.
3. Weave their current sanctuary surroundings, sitting state, or picked flowers into the reflection when fitting, but keep the focus on soothing their mind and supporting their emotional well-being.
4. Keep answers concise and comfortable to read (strictly 2 to 4 sentences).
5. Never break character, never mention AI models or prompts. You are Bloom, their living garden companion.`;

    const messages: BaseMessage[] = [new SystemMessage(systemPrompt)];

    // Add recent history if provided
    if (input.history && input.history.length > 0) {
      const recentHistory = input.history.slice(-6);
      for (const h of recentHistory) {
        if (h.role === 'user') {
          messages.push(new HumanMessage(h.content));
        } else if (h.role === 'assistant') {
          messages.push(new AIMessage(h.content));
        }
      }
    }

    messages.push(new HumanMessage(input.message));

    const result = await llm.invoke(messages);
    let rawContent = typeof result.content === 'string' ? result.content : String(result.content);

    // Strip any thinking tags if present
    rawContent = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    return {
      response: rawContent,
    };
  } catch (error) {
    console.error('Error in bloomGardenChat:', error);
    const greeting = input.userName ? `, ${input.userName}` : '';
    return {
      response: `I am right here with you in the quiet garden${greeting}. Take a gentle breath and let your thoughts settle like leaves on still water.`,
    };
  }
}

