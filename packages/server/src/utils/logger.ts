// ============================================================================
// Logging Utility
// ============================================================================

export const logger = {
  info: (msg: string, data?: unknown) => {
    const ts = new Date().toISOString();
    if (data !== undefined) {
      if (typeof data === 'object') {
        console.log(`[${ts}] INFO: ${msg}`, JSON.stringify(data));
      } else {
        console.log(`[${ts}] INFO: ${msg}`, data);
      }
    } else {
      console.log(`[${ts}] INFO: ${msg}`);
    }
  },
  warn: (msg: string, data?: unknown) => {
    const ts = new Date().toISOString();
    console.warn(`[${ts}] WARN: ${msg}`, data !== undefined ? JSON.stringify(data) : '');
  },
  error: (msg: string, data?: unknown) => {
    const ts = new Date().toISOString();
    console.error(`[${ts}] ERROR: ${msg}`, data !== undefined ? JSON.stringify(data) : '');
  },
  audit: (msg: string, data?: unknown) => {
    const ts = new Date().toISOString();
    console.log(`[${ts}] AUDIT: ${msg}`, data !== undefined ? JSON.stringify(data) : '');
  },
};
