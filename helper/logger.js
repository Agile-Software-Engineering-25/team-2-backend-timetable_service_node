const pino = require('pino');
const { getContext } = require('./context');
require('dotenv/config');


const notifiedErrors = new Set();


const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: () => `,"time":"${new Date().toISOString()}"`
}, pino.transport({
  target: 'pino/file',
  options: { destination: process.env.APP_DIR + '/logs/api.log' }
}));

module.exports = logger;

const originalError = logger.error.bind(logger);

// Überschreiben von logger.error
logger.error = function (...args) {
  try {
    let message, meta;
    if (typeof args[0] === 'object' && typeof args[1] === 'string') {
      meta = args[0];
      message = args[1];
    } else if (typeof args[0] === 'string') {
      message = args[0];
      meta = {};
    }

    const context = getContext();
    const combinedMeta = { ...context, ...meta };

    notifyAdmin(message, combinedMeta).catch(e => {
      originalError('Fehler beim notifyAdmin:', e);
    });
  } catch (err) {
    originalError('Fehler in custom logger.error:', err);
  }
  return originalError(...args);
};

async function notifyAdmin(message, meta) {
    const apiPath = meta?.path || 'Unbekannter Pfad';
    const errorKey = `${apiPath}|${message}`; // Schlüssel, um Fehler eindeutig zu identifizieren

    if (notifiedErrors.has(errorKey)) {
        // Fehler schon gemeldet → keine Mail senden
        logger.info('Fehler wurde bereits gemeldet, sende keine Mail.');
        return;
    }

    const { sendAdminNotification } = require('./sendConfirmation'); // Lazy require
    const stackTrace = meta?.err?.stack || 'Kein Stacktrace verfügbar';

    const subject = `🚨 Fehler in API ${apiPath}`;
    const body = `
        Pfad: ${apiPath}\n
        Methode: ${meta?.method || 'unbekannt'}\n
        Fehlermeldung: ${message}\n
        Stacktrace: ${stackTrace}
    `;

    await sendAdminNotification(process.env.ADMIN_MAIL, subject, body);

    notifiedErrors.add(errorKey); // Fehler als gemeldet markieren
}

