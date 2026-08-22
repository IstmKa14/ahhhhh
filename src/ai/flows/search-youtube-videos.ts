'use server';

/**
 * @fileOverview This file defines a LangChain flow for searching YouTube videos.
 * It uses a custom tool to interact with the YouTube Data API and filters out harmful queries.
 */

import { youtubeSearchTool } from '../tools/youtube-search';
import { YoutubeSearchInputSchema, YoutubeSearchOutputSchema, YoutubeSearchInput, YoutubeSearchOutput } from '@/ai/schemas/youtube-search';
import { isMockMode } from '@/ai/llm';

// List of banned keywords to prevent harmful searches
const BANNED_KEYWORDS = [
  'suicide', 'self-harm', 'selfharm', 'kill myself', 'how to die', 'schizophrenia', 'disturbing',
];

export async function searchYoutubeVideos(input: YoutubeSearchInput): Promise<YoutubeSearchOutput> {
  try {
    const { query } = input;
    const lowerCaseQuery = query.toLowerCase();

    // 1. Filter for banned keywords
    const isHarmfulQuery = BANNED_KEYWORDS.some(keyword => lowerCaseQuery.includes(keyword));

    if (isHarmfulQuery) {
      return { videos: [] };
    }

    if (isMockMode) {
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

    // 2. Call the YouTube search tool with the original query using LangChain's invoke
    const searchResultString = await youtubeSearchTool.invoke({ query });
    const items = JSON.parse(searchResultString);

    // 3. Map the results to the output schema
    return {
      videos: (items || []).map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url
      }))
    };
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
