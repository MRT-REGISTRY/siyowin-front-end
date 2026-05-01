# Supabase Setup

SQL files:

- `sql/001_schema.sql`
- `sql/002_seed.sql`

## Run With Node

Add your Supabase Postgres connection string to `Back-end/.env`:

```env
SUPABASE_DB_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
```

Then run:

```powershell
cd Back-end
npm run db:setup
```

You can also paste both SQL files into the Supabase SQL editor and run them in order.
