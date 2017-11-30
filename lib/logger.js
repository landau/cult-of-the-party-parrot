'use strict';

const config = require('config');
const pino = require('pino');

const logger = pino({
  name: 'parrots',
  level: config.get('logger.level'),
  enabled: config.get('logger.enabled'),
});

exports.logger = logger;
exports.createModuleLogger = createModuleLogger;

function createModuleLogger(filename, dirname) {
  return logger.child({ module: filename.slice(dirname.length + 1, -3) });
}
