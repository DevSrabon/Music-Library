/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from 'pg';

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default db;
