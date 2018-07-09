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
  };

  return config;
};
