import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Neon PostgreSQL connection string (configured for JustRefer)
const connectionString = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_nXrlHtoDbT02@ep-holy-block-arp85ea3-pooler.c-4.us-west-2.aws.neon.tech/neondb?sslmode=verify-full';

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
});

// Prevent unhandled errors from idle connection terminations by Neon PostgreSQL
pool.on('error', (err) => {
  console.warn('[DB Pool] Idle client connection closed or reset by server:', err.message);
});

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  return res;
}
