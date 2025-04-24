-- Check if vector extension is available in the current schema
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Check table structure
\d dhanush_personal_data;

-- Check if there's any data
SELECT COUNT(*) FROM dhanush_personal_data;

-- Check a sample row
SELECT id, category, substring(chunk_text, 1, 50) as sample_text, 
       array_length(embedding::float8[], 1) as embedding_dimension
FROM dhanush_personal_data 
LIMIT 1; 