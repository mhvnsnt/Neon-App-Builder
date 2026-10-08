// Load .env.local / .env before any other server module reads process.env.
// Imported first in server.ts (ESM evaluates imports in order).
import dotenv from 'dotenv';
dotenv.config({ path: ['.env.local', '.env'], quiet: true });
