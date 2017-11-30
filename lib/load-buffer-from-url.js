'use strict';

const fetch = require('node-fetch');
const logger = require('./logger').createModuleLogger(__filename, __dirname);

module.exports = loadBufferFromUrl;

async function loadBufferFromUrl(url) {
  logger.debug({ url }, 'Loading buffer');
  const res = await fetch(url);
  const body = await res.buffer();
  logger.debug({ url }, 'Buffer loaded');
  return body;
}
