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

const logFile = path.join(logDir, 'api.log');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: () => `,"time":"${new Date().toISOString()}"`
}, pino.transport({
  target: 'pino/file',
  options: { destination: logFile }
}));

module.exports = logger;
