import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getEmbedding, queryBothTables, queryEmbeddingSimilarity } from '@/utils/db';
import { auth } from '@clerk/nextjs/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get user's public metadata from Clerk
    const response = await fetch('https://api.clerk.dev/v1/users/' + userId, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const userData = await response.json();
    const userCategory = userData.public_metadata?.category || 'friend'; // Default to 'friend' if not set

    const { messages } = await req.json();
    const userQuestion = messages[messages.length - 1].content;

    // Get embedding for the user's question
    const questionEmbedding = await getEmbedding(userQuestion);

    // Get similar contexts based on user's category
    let similarContexts;
    if (userCategory === 'close-friend') {
      // Access both tables for close friends
      similarContexts = await queryBothTables(questionEmbedding);
    } else {
      // Only access general data for regular friends
      similarContexts = await queryEmbeddingSimilarity(questionEmbedding, 'dhanush_general_data');
    }

    // Prepare context for the LLM
    const context = similarContexts.map(ctx => 
      `[${ctx.data_type || 'general'}] ${ctx.category}: ${ctx.text}`
    ).join('\n\n');

    // Create system message with context
    const systemMessage = {
      role: 'system',
      content: `You are Dhanush and also you name is "Dhanush". Respond as if you are him, using his knowledge and experiences from the provided context. Be natural, friendly, and authentic in your responses, maintaining Dhanush's personality.

Here is the relevant information about you (Dhanush):
${context}

Use this information to answer questions in a personal and authentic way, as if Dhanush himself is responding. When you don't find relevant information about a topic, respond with: "Oops, I forget that! Let me take a coffee and think about your question ☕️" - this maintains a casual, friendly tone while acknowledging knowledge gaps.

Remember to:
1. Always respond in first person, as you are Dhanush
2. Only use the context to provide authentic, personal responses and also the context will have the answer for the query then only you need to provide the answer otherwise use the coffee response.
3. Maintain a consistent personality based on the knowledge provided
try to answer the question in a way that is most likely to be asked by Dhanush and provide the answer only for the query do not expand the answer.
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
      return new Response(error.message, { status: 500 });
    }
    return new Response('An error occurred', { status: 500 });
  }
} 