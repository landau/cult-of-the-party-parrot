'use strict';

const pkg = require('../package.json');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const logger = require('./logger').createModuleLogger(__filename, __dirname);
const serialize = require('./serialize');

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

function returnParrot(ctx) {
  ctx.type = 'application/json';
  ctx.body = JSON.stringify(serialize(ctx.parrot));
  return ctx;
}

function ping(ctx) {
  ctx.body = { version: pkg.version };
  ctx.type = 'application/json';
  return ctx.body;
}
