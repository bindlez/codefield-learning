import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

test('the startup URL serves the app directory index', async t => {
  const reservation = createServer();
  await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const server = spawn(process.execPath, ['server.js'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, CODEFIELD_PORT: String(port), HOST: '127.0.0.1' }
  });
  t.after(() => server.kill());
  await new Promise((resolve, reject) => {
    server.stdout.once('data', resolve);
    server.once('error', reject);
    server.once('exit', code => reject(new Error('Server exited with code ' + code)));
  });
  const base = 'http://127.0.0.1:' + port;
  const response = await fetch(base + '/', { redirect: 'follow' });
  assert.equal(response.status, 200);
  assert.match(response.url, /\/app\/$/);
  assert.match(await response.text(), /Codefield/);
  assert.equal((await fetch(base + '/app/')).status, 200);
  assert.equal((await fetch(base + '/server.js')).status, 404);
});
