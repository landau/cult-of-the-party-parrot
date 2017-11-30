'use strict';

const pkg = require('./package.json');
const config = require('config');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaPinoLogger = require('koa-pino-logger');

const loadWebpage = require('./lib/load-webpage');
const getParrots = require('./lib/get-parrots');
const { logger } = require('./lib/logger');
const serialize = require('./lib/serialize');

if (require.main === module) {
  (async function start() {
    try {
      const SERVER_PORT = config.get('server.port');
      const html = await loadWebpage(config.get('parrotUrl'));

      const app = new Koa();
      app.env = config.get('env');

      const router = new KoaRouter();

      Object.defineProperty(app.context, 'parrots', {
        get() {
          return getParrots(html);
        }
      });

      router
        .param('name', (name, ctx, next) => {
          logger.info(`Looking for parrot ${name}`);
          const parrot = ctx.parrots.find(name);

          if (!parrot) {
            ctx.status = 404;
            return ctx;
          }

          logger.info({ parrot }, 'Parrot found.');
          ctx.parrot = parrot;

          return next();
        })
        .get('/parrots/:name', ctx => {
          ctx.type = 'application/json';
          ctx.body = JSON.stringify(serialize(ctx.parrot));
          return ctx;
        });

      router.get('random', '/random', ctx => {
        const parrot = ctx.parrots.getRandom();
        ctx.type = 'application/json';
        ctx.body = JSON.stringify(serialize(parrot));
        return ctx;
      });

      router.get('ping', '/ping', ctx => {
        ctx.body = { version: pkg.version };
        ctx.type = 'application/json';
        return ctx.body;
      });

      app.use(koaPinoLogger());
      app.use(router.routes());
      app.use(router.allowedMethods());

      app.listen(config.get('server.port'));
      logger.info(`Server started on ${SERVER_PORT}`);
    } catch (err) {
      logger.error(err, 'Failed to start application');
      process.exit(1);
    }
  }());
}
