'use strict';

const config = require('config');

const HOST = `http://${config.get('server.host')}:${config.get('server.port')}`;

module.exports = serialize;

function serialize(parrot) {
  return Object.assign(
    {
      self: {
        uri: `${HOST}/parrots/${encodeURIComponent(parrot.name)}`
      }
    },
    parrot
  );
}
