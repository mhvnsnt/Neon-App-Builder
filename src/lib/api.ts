/**
 * Authenticated fetch for the Neon API.
 *
 * The server requires `Authorization: Bearer <APP_AUTH_TOKEN>` on every /api call.
 * The token is kept in this browser's localStorage (never in the bundle). If the
 * server answers 401, the user is prompted once for the token and the request is retried.
 */
const STORAGE_KEY = 'neon_auth_token';

export function getAuthToken(): string {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export function setAuthToken(token: string) {
  if (token) localStorage.setItem(STORAGE_KEY, token);
  else localStorage.removeItem(STORAGE_KEY);
}

function withAuth(init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers || {});
  const token = getAuthToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return { ...init, headers };
}

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  let res = await fetch(input, withAuth(init));
  if (res.status === 401) {
    const entered = window.prompt('Enter the Neon access token (APP_AUTH_TOKEN set on the server):');
    if (entered) {
      setAuthToken(entered.trim());
      res = await fetch(input, withAuth(init));
    }
  }
  return res;
}
