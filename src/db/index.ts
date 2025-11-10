import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg'; // 'pg' is the underlying PostgreSQL driver
import 'dotenv/config'; // Loads environment variables from .env file



/**
 * Creates a connection pool for the database.
 * This is much more efficient than creating a new connection for every query.
 */
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool);