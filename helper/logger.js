const pino = require('pino');
const path = require('path');
const fs = require('fs');
const { getContext } = require('./context');
require('dotenv/config');

// Sichere Pfad-Erstellung für Logs
const APP_DIR = process.env.APP_DIR || __dirname + '/../';
const logDir = path.join(APP_DIR, 'logs');

// Stelle sicher, dass das logs-Verzeichnis existiert
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: process.env.APP_DIR + '/logs/api.log' },
      level: process.env.LOG_LEVEL || 'info'
    },
    {
      target: 'pino-pretty', // Schönes Format für Konsole
      options: { colorize: true },
      level: process.env.LOG_LEVEL || 'info'
    }
  ]
});
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: () => `,"time":"${new Date().toISOString()}"`
}, transport);

module.exports = logger;
