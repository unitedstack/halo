'use strict';
const path = require('path');
// add you build-in plugin here, example:
module.exports = {
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  sequelize: {
    enable: false,
    package: 'egg-sequelize',
  },
  ue: {
    enable: true,
    package: '@ustack/egg-ue',
  },
  io: {
    enable: false,
    path: path.join(__dirname, '../lib/egg-socket.io'),
  },
  redis: {
    enable: false,
    path: path.join(__dirname, '../lib/egg-redis'),
  },
  sessionRedis: {
    enable: false,
    package: 'egg-session-redis',
  },
};
