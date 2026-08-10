// lib/db.ts
// Shared Postgres connection pool. Requires `pg` package: npm install pg
// Set DATABASE_URL in your .env file, e.g.
// DATABASE_URL=postgresql://user:password@localhost:5432/rakvih

import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

export const pool =
  global._pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}