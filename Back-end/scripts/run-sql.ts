import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error('SUPABASE_DB_URL is required to run SQL files.');
  console.error('Add the Supabase Postgres connection string to Back-end/.env, then run: npm run db:setup');
  process.exit(1);
}

const sqlDir = path.resolve('supabase/sql');
const files = ['001_schema.sql', '002_seed.sql'];
const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

try {
  for (const file of files) {
    const sql = await fs.readFile(path.join(sqlDir, file), 'utf8');
    console.log(`Running ${file}`);
    await client.query(sql);
  }
  console.log('Supabase schema and seed completed.');
} finally {
  await client.end();
}
