import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Bearer-token auth middleware.
 *
 * Set APP_AUTH_TOKEN in the environment (e.g. .env.local, never committed).
 * Every /api request must send `Authorization: Bearer <APP_AUTH_TOKEN>`.
 *
 * If APP_AUTH_TOKEN is unset the server refuses to serve the API at all
 * (fail closed) instead of silently running wide open.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.APP_AUTH_TOKEN;
  if (!expected) {
    return res.status(503).json({
      error: 'Server auth not configured. Set APP_AUTH_TOKEN before starting the server.',
    });
  }
  const header = req.header('authorization') || '';
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m || !timingSafeEqual(m[1], expected)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

/** Mask a secret so presence is visible but the value is not. */
export function maskSecret(v: unknown): string {
  if (typeof v !== 'string' || v.length === 0) return '';
  if (v.length <= 4) return '****';
  return v.slice(0, 2) + '****' + v.slice(-2);
}
