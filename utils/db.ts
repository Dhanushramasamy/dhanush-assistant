import { Pool } from '@neondatabase/serverless';
import { OpenAI } from 'openai';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test the database connection
pool.query('SELECT NOW()').catch(err => {
  console.error('Database connection error:', err);
});

export async function queryEmbeddingSimilarity(embedding: number[], limit: number = 10) {
  const query = `
    SELECT text, 1 - (embedding <=> $1::vector) as similarity
    FROM data_dhanush_knowledge
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> $1::vector
    LIMIT $2;
  `;

  try {
    const result = await pool.query(query, [JSON.stringify(embedding), limit]);
    return result.rows;
  } catch (error) {
    console.error('Error querying embeddings:', error);
    throw new Error('Failed to query similar documents');
  }
}

export async function getEmbedding(text: string): Promise<number[]> {
  if (!text?.trim()) {
    throw new Error('Text is required for embedding generation');
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text.trim(),
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
} 