'use strict';

const config = require('config');

const loadWebpage = require('./lib/load-webpage');
const getParrots = require('./lib/get-parrots');
const { logger } = require('./lib/logger');
const createApp = require('./lib/create-app');

if (require.main === module) {
  (async function start() {
    try {
      const SERVER_PORT = config.get('server.port');
      const html = await loadWebpage(config.get('parrotUrl'));
      const parrots = getParrots(html);
      const app = createApp({
        parrots,
        env: config.get('env')
      });


      app.listen(config.get('server.port'));
      logger.info(`Server started on ${SERVER_PORT}`);
    } catch (err) {
      logger.error(err, 'Failed to start application');
      process.exit(1);
    }
  }());
}
