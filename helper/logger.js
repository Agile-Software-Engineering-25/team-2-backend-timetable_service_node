const pino = require('pino');
const path = require('path');
const fs = require('fs');
const { getContext } = require('./context');
require('dotenv/config');

// Basisverzeichnis für Logs
const APP_DIR = process.env.APP_DIR
    ? path.resolve(process.env.APP_DIR)
    : path.resolve(__dirname, '..');

// logs-Verzeichnis erstellen
const logDir = path.join(APP_DIR, 'logs');
fs.mkdirSync(logDir, { recursive: true });

// log-Datei festlegen
const destinationFile = path.join(logDir, 'api.log');

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: destinationFile },
      level: process.env.LOG_LEVEL || 'info'
    },
    {
      target: 'pino-pretty', // Schönes Format für Konsole
      options: { colorize: true },
      level: process.env.LOG_LEVEL || 'info'
    }
  ]
});


// Logger erstellen und exportieren
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: () => `,"time":"${new Date().toISOString()}"`
}, transport);

module.exports = logger;
