import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_nXrlHtoDbT02@ep-holy-block-arp85ea3-pooler.c-4.us-west-2.aws.neon.tech/neondb?sslmode=verify-full';

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  // Prevent unhandled errors from idle connection terminations by Neon PostgreSQL
  console.warn('[DB Pool] Idle client connection closed or reset by server:', err.message);
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  return res;
}

