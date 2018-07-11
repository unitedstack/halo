'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = () => {
  const config = {
    siteFile: {
      '/favicon.ico': readFileSync(join(__dirname, 'favicon.png')),
    },
    httpclient: {
      request: {
        timeout: [ 30000, 600000 ],
      },
    },
    io: {
      namespace: {
        '/': {
          connectionMiddleware: [],
          packetMiddleware: [],
        },
      },
      redis: {
        host: '127.0.0.1',
        port: 6379,
        auth_pass: '',
        db: 0,
      },
    },
  };

  return config;
};
