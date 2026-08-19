
'use server';

/**
 * @fileOverview This file defines a Genkit flow for searching YouTube videos.
 *
 * It uses a custom tool to interact with the YouTube Data API and filters out
 * harmful queries.
 *
 * @exports searchYoutubeVideos - The main function to trigger the YouTube search flow.
 */

import { ai } from '@/ai/genkit';
import { youtubeSearchTool } from '../tools/youtube-search';
import { YoutubeSearchInputSchema, YoutubeSearchOutputSchema, YoutubeSearchInput, YoutubeSearchOutput } from '@/ai/schemas/youtube-search';

// List of banned keywords to prevent harmful searches
const BANNED_KEYWORDS = [
  'suicide', 'self-harm', 'selfharm', 'kill myself', 'how to die', 'schizophrenia', 'disturbing',
  // Add other sensitive or 18+ terms as needed
];

export async function searchYoutubeVideos(input: YoutubeSearchInput): Promise<YoutubeSearchOutput> {
  try {
    return await searchYoutubeVideosFlow(input);
  } catch (error) {
    console.error("Suppressed API Error in searchYoutubeVideos:", error);
    return {
      videos: [
        {
          id: "5qap5aO4i9A",
          title: "10 Minute Mindfulness Meditation",
          thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500"
        },
        {
          id: "z6X5o0n44SU",
          title: "Calming River Sounds for Relaxation",
          thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500"
        }
      ]
    };
  }
}

const searchYoutubeVideosFlow = ai.defineFlow(
  {
    name: 'searchYoutubeVideosFlow',
    inputSchema: YoutubeSearchInputSchema,
    outputSchema: YoutubeSearchOutputSchema,
  },
  async ({ query }) => {
    const lowerCaseQuery = query.toLowerCase();

    // 1. Filter for banned keywords
    const isHarmfulQuery = BANNED_KEYWORDS.some(keyword => lowerCaseQuery.includes(keyword));

    if (isHarmfulQuery) {
      // If the query is harmful, return an empty result immediately
      return { videos: [] };
    }

    // 2. Call the YouTube search tool with the original query
    const searchResult = await youtubeSearchTool({ query });

    // 3. Map the results to the output schema
    return {
      videos: searchResult.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url
      }))
    };
  }
);
