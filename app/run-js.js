// Run one snippet in a fresh worker so `const` declarations never leak between examples.
export function runOnce(code, timeoutMs = 6000) {
  return new Promise(resolve => {
    let worker;
    try {
      worker = new Worker('./javascript-worker.js', { type: 'module' });
    } catch (error) {
      resolve({ ok: false, error: error.message });
      return;
    }
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ ok: false, error: `Stopped after ${Math.round(timeoutMs / 1000)} seconds. Check for an infinite loop.` });
    }, timeoutMs);
    worker.onmessage = event => {
      if (event.data.type !== 'result') return;
      clearTimeout(timer);
      worker.terminate();
      resolve(event.data.result);
    };
    worker.onerror = event => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ ok: false, error: event.message || 'The JavaScript worker failed.' });
    };
    worker.postMessage({ type: 'run', code });
  });
}
