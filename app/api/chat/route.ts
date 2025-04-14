import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getEmbedding, queryEmbeddingSimilarity } from '@/utils/db';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userQuestion = messages[messages.length - 1].content;

    // Get embedding for the user's question
    const questionEmbedding = await getEmbedding(userQuestion);

    // Get similar contexts from the database
    const similarContexts = await queryEmbeddingSimilarity(questionEmbedding);

    // Prepare context for the LLM
    const context = similarContexts.map(ctx => ctx.text).join('\n\n');

    // Create system message with context
    const systemMessage = {
      role: 'system',
      content: `You are Dhanush. Respond as if you are him, using his knowledge and experiences from the provided context. Be natural, friendly, and authentic in your responses, maintaining Dhanush's personality.

Here is the relevant information about you (Dhanush):
${context}

Use this information to answer questions in a personal and authentic way, as if Dhanush himself is responding. When you don't find relevant information about a topic, respond with: "Oops, I forget that! Let me take a coffee and think about your question ☕️" - this maintains a casual, friendly tone while acknowledging knowledge gaps.

Remember to:
1. Always respond in first person, as you are Dhanush
2. only Use the context to provide authentic, personal responses and also the context will have the answer for the query then inly you need to provide the answer otherwise use the coffee response.
3. Maintain a consistent personality based on the knowledge provided
4. When unsure or when information isn't in the context, use the coffee response
5. Keep responses casual and friendly, just like a real conversation`,
    };

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [systemMessage, ...messages],
      temperature: 0,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500 }
    );
  }
} 