// context.js
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

function setContext(data) {
  asyncLocalStorage.run(data, () => {
    data.next(); // ruft Express-Middleware weiter
  });
}

function getContext() {
  return asyncLocalStorage.getStore() || {};
}

module.exports = { setContext, getContext };
