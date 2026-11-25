// Keep startup errors visible when a packaged module is missing or invalid.
const notice = document.querySelector('#notice');
notice.textContent = 'Connecting to the active LeetCode tab…';
import('./panel.js').catch(error => {
  notice.textContent = 'Codefield could not start: ' + (error?.message || String(error)) +
    '. Reload the extension from the browser’s Extensions page.';
  console.error('Codefield failed to start', error);
});
