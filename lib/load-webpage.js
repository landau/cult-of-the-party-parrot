'use strict';

const fetch = require('node-fetch');
const logger = require('./logger').createModuleLogger(__filename, __dirname);

module.exports = loadWebpage;

async function loadWebpage(url) {
  logger.debug({ url }, 'Loading webpage');
  const res = await fetch(url);
  const body = await res.text();
  logger.debug({ url }, 'Webpage loaded');
  return body;
}
