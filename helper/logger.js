const pino = require('pino');
const { getContext } = require('./context');
require('dotenv/config');




const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: () => `,"time":"${new Date().toISOString()}"`
}, pino.transport({
  target: 'pino/file',
  options: { destination: process.env.APP_DIR + '/logs/api.log' }
}));

module.exports = logger;


