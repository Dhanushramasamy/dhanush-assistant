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

type TableName = 'dhanush_personal_data' | 'dhanush_general_data';

export async function queryEmbeddingSimilarity(
  embedding: number[], 
  tableName: TableName,
  limit: number = 10,
  category?: string
) {
  const query = `
    SELECT 
      id,
      category,
      chunk_text as text,
      1 - (embedding <=> $1::vector) as similarity
    FROM ${tableName}
    WHERE embedding IS NOT NULL
    ${category ? 'AND category = $3' : ''}
    ORDER BY embedding <=> $1::vector
    LIMIT $2;
  `;

  try {
    const params = category 
      ? [JSON.stringify(embedding), limit, category]
      : [JSON.stringify(embedding), limit];
    
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error querying embeddings:', error);
    throw new Error(`Failed to query similar documents from ${tableName}`);
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

export async function storeEmbedding(
  text: string,
  embedding: number[],
  tableName: TableName,
  category: string,
  chunkIndex: number,
  totalChunks: number
) {
  const query = `
    INSERT INTO ${tableName} 
    (category, chunk_text, chunk_index, total_chunks, embedding)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;

  try {
    const result = await pool.query(query, [
      category,
      text,
      chunkIndex,
      totalChunks,
      JSON.stringify(embedding)
    ]);
    return result.rows[0].id;
  } catch (error) {
    console.error('Error storing embedding:', error);
    throw new Error(`Failed to store embedding in ${tableName}`);
  }
}

export async function queryBothTables(
  embedding: number[],
  limit: number = 10,
  category?: string
) {
  const query = `
    WITH combined_results AS (
      (
        SELECT 
          id,
          category,
          chunk_text as text,
          1 - (embedding <=> $1::vector) as similarity,
          'personal' as data_type
        FROM dhanush_personal_data
        WHERE embedding IS NOT NULL
        ${category ? 'AND category = $2::varchar' : ''}
      )
      UNION ALL
      (
        SELECT 
          id,
          category,
          chunk_text as text,
          1 - (embedding <=> $1::vector) as similarity,
          'general' as data_type
        FROM dhanush_general_data
        WHERE embedding IS NOT NULL
        ${category ? 'AND category = $2::varchar' : ''}
      )
    )
    SELECT *
    FROM combined_results
    ORDER BY similarity DESC
    LIMIT ${category ? '$3' : '$2'}::integer;
  `;

  try {
    const embeddingString = `[${embedding.join(',')}]`;
    const params = category 
      ? [embeddingString, category, limit]
      : [embeddingString, limit];
    
    console.log('Query:', query);  // Debug log
    console.log('Params:', params);  // Debug log
    
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error querying tables:', error);
    throw new Error('Failed to query similar documents from tables');
  }
} 