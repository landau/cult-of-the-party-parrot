'use strict';

const pkg = require('../package.json');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const logger = require('./logger').createModuleLogger(__filename, __dirname);
const serialize = require('./serialize');
const loadBufferFromUrl = require('./load-buffer-from-url');
const config = require('config');
const koaPinoLogger = require('koa-pino-logger');

const PARROT_URL = config.get('parrotUrl');

module.exports = createServer;

function createServer({ parrots, env }) {
  const app = new Koa();
  app.env = env;

  const router = new KoaRouter();

  Object.defineProperty(app.context, 'parrots', {
    value: parrots,
    enumerable: true,
    writable: false
  });

  router
    .param('name', getParrotByName)
    .get('/parrots/:name', returnParrot);

  router.get('random', '/random', random);
  router.get('ping', '/ping', ping);

  app.use(koaPinoLogger());
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

function getParrotByName(name, ctx, next) {
  logger.info(`Looking for parrot ${name}`);
  const parrot = ctx.parrots.find(name);

  if (!parrot) {
    ctx.status = 404;
    return ctx;
  }

  logger.info({ parrot }, 'Parrot found.');
  ctx.parrot = parrot;

  return next();
}

function random(ctx) {
  ctx.parrot = ctx.parrots.getRandom();
  return returnParrot(ctx);
}

async function returnParrot(ctx) {
  const type = ctx.headers['content-type'];

  if (type === 'application/json') {
    ctx.body = JSON.stringify(serialize(ctx.parrot));
    ctx.type = type;
  } else {
    const url = `${PARROT_URL}${ctx.parrot.url}`;
    ctx.body = await loadBufferFromUrl(url);
    ctx.type = 'image/gif';
  }

  return ctx;
}

function ping(ctx) {
  ctx.body = { version: pkg.version };
  ctx.type = 'application/json';
  return ctx.body;
}
