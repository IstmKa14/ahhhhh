import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;
const isValidDatabaseUrl =
  connectionString &&
  connectionString.startsWith('postgresql://') &&
  !connectionString.includes('user:password@ep-sample-123456');

export const sql = isValidDatabaseUrl ? neon(connectionString) : null;
export const db = sql ? drizzle(sql, { schema }) : null;

