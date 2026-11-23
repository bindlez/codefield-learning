import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let config = {};
try {
  const parsed = JSON.parse(readFileSync(join(root, 'codefield.local.json'), 'utf8'));
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) config = parsed;
} catch {
  config = {};
}

/** Machine-local defaults (gitignored): model addresses, model ids and optional keys. */
export const localConfig = config;
