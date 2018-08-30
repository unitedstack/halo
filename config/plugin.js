'use strict';

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
    package: 'egg-socket.io',
  },
  redis: {
    enable: false,
    package: 'egg-redis',
  },
  sessionRedis: {
    enable: false,
    package: 'egg-session-redis',
  },
};
