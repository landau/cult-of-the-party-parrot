'use strict';

const cheerio = require('cheerio');
const logger = require('./logger').createModuleLogger(__filename, __dirname);
const getRandomItem = require('./get-random-item');

module.exports = getParrots;

function getParrots(html) {
  logger.debug('Finding parrots in html');
  const $ = cheerio.load(html);
  const parrots = $('ul')
    .first()
    .find('img')
    .map(function map() {
      const $el = $(this);
      return {
        url: $el.attr('src'),
        name: $el.attr('alt')
      };
    })
    .get();

  return {
    getRandom,
    find
  };

  function getRandom() {
    return getRandomItem(parrots);
  }

  function find(name) {
    return parrots.find(p => p.name === name);
  }
}
