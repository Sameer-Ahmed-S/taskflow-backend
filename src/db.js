import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://taskflow:taskflow@localhost:5432/taskflow',
});
