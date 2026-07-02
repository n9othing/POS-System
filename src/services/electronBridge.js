/**
 * electronBridge.js
 * Safe wrappers around Electron IPC calls.
 * All functions are no-ops (with console warnings) when running in a plain browser.
 */

const isElectron = () =>
  typeof window !== 'undefined' && typeof window['require'] === 'function';

/**
 * Saves end-of-day totals to the SQLite database via Electron IPC.
 * @param {{ totalRevenue: number, totalOrders: number }} data
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const saveEndOfDay = (data) =>
  new Promise((resolve) => {
    if (!isElectron()) {
      console.warn('[electronBridge] Not running in Electron — skipping IPC saveEndOfDay');
      resolve({ success: true, browserMode: true });
      return;
    }
    const { ipcRenderer } = window['require']('electron');
    ipcRenderer.send('save-end-of-day', data);
    ipcRenderer.once('save-end-of-day-reply', (_event, response) => {
      resolve(response);
    });
  });
