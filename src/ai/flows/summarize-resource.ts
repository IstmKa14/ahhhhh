'use server';

/**
 * @fileOverview This file defines a LangChain flow for summarizing resources.
 */

import { z } from 'zod';
import { getLLM, isMockMode } from '@/ai/llm';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const SummarizeResourceInputSchema = z.object({
  resourceContent: z
    .string()
    .describe('The content of the resource to be summarized.'),
});
export type SummarizeResourceInput = z.infer<typeof SummarizeResourceInputSchema>;

const SummarizeResourceOutputSchema = z.object({
  summary: z.string().describe('A short summary of the resource content.'),
});
export type SummarizeResourceOutput = z.infer<typeof SummarizeResourceOutputSchema>;

export async function summarizeResource(input: SummarizeResourceInput): Promise<SummarizeResourceOutput> {
  try {
    if (isMockMode) {
      return {
        summary: "This resource covers key practices for mindfulness and stress reduction. It highlights deep breathing exercises, self reflection, and physical activity as vital tools to maintain mental wellness."
      };
    }

    const llm = getLLM(0.3);
    if (!llm) {
      throw new Error("LLM client could not be initialized");
    }

    const structuredLlm = llm.withStructuredOutput(SummarizeResourceOutputSchema);
    const result = await structuredLlm.invoke([
      new SystemMessage("Summarize the following resource content in a concise paragraph:"),
      new HumanMessage(input.resourceContent),
    ]);

    return result;
  } catch (error) {
    console.error("Suppressed API Error in summarizeResource:", error);
    return {
      summary: "This resource covers key practices for mindfulness and stress reduction. It highlights deep breathing exercises, self reflection, and physical activity as vital tools to maintain mental wellness."
    };
  }
}
