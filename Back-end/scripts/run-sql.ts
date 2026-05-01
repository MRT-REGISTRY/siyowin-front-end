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

const schemaFile = path.resolve('..', 'postgreSchema.sql');
const seedFile = path.resolve('supabase/sql/002_seed.sql');
const client = new pg.Client({
  connectionString: dbUrl.replace(/#/g, '%23'),
  ssl: { rejectUnauthorized: false },
});

await client.connect();

try {
  for (const file of [schemaFile, seedFile]) {
    const sql = await fs.readFile(file, 'utf8');
    console.log(`Running ${path.basename(file)}`);
    await client.query(sql);
  }
  console.log('Supabase schema and seed completed.');
} finally {
  await client.end();
}
