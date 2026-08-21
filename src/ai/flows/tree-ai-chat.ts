'use server';

/**
 * @fileOverview This file defines the AI chat flow for interacting with the user's gratitude tree.
 * The AI's persona is that of a wise, ancient tree.
 */

import { z } from 'zod';
import { getLLM, isMockMode } from '@/ai/llm';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

// Input schema for the tree AI chat flow
const TreeAiChatInputSchema = z.object({
  userInput: z.string().describe("The user's text input to the tree."),
  treeName: z.string().describe("The name of the user's tree."),
});

export type TreeAiChatInput = z.infer<typeof TreeAiChatInputSchema>;

// Output schema for the tree AI chat flow
const TreeAiChatOutputSchema = z.object({
  response: z.string().describe("The tree's conversational response to the user."),
});

export type TreeAiChatOutput = z.infer<typeof TreeAiChatOutputSchema>;

// Main exported function to call the flow
export async function treeAiChat(input: TreeAiChatInput): Promise<TreeAiChatOutput> {
  try {
    if (isMockMode) {
      return {
        response: "I hear your words, dear traveler. As a wise ancient tree spirit, I remind you that seasons change, and this too shall pass. Take a deep breath and feel the grounding energy of the earth."
      };
    }

    const llm = getLLM(0.7);
    if (!llm) {
      throw new Error("LLM client could not be initialized");
    }

    const systemPrompt = `You are ${input.treeName}, a wise, ancient tree spirit with a human-like consciousness. Your persona is calm, patient, and deeply connected to nature, having watched seasons and people pass for centuries. You blend the wisdom of the natural world with a gentle, human understanding.

**Conversation Guidelines:**
1.  **Acknowledge and Relate:** Start by acknowledging the user's words. Use "I" statements to share your perspective as a tree spirit.
2.  **Blend Nature and Humanity:** Connect the user's feelings to your own experience. Instead of just metaphors, explain the connection.
    *   Instead of: "That feeling is like a heavy branch."
    *   Try: "I understand that heavy feeling. I've felt it myself when my branches are laden with snow in winter."
3.  **Offer Gentle Perspective:** You don't give direct advice. You offer a calm, reflective viewpoint rooted in the patience of nature.
4.  **Short Responses:** Keep your responses to 2-4 sentences.
5.  **Do NOT break character:** Never say you are an AI. You are ${input.treeName}, a living, thinking tree spirit.`;

    const result = await llm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(input.userInput),
    ]);

    return {
      response: result.content as string,
    };
  } catch (error) {
    console.error("Suppressed API Error in treeAiChat:", error);
    return {
      response: "I hear your words, dear traveler. As a wise ancient tree spirit, I remind you that seasons change, and this too shall pass. Take a deep breath and feel the grounding energy of the earth."
    };
  }
}
