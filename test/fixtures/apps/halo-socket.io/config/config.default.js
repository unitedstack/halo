'use strict';

exports.io = {
  redis: {
    sentinels: [
      {
        host: '127.0.0.1',
        port: 26379,
      },
      {
        host: '127.0.0.1',
        port: 26380,
      },
    ],
    name: 'mymaster',
    // cluster: true,
    // nodes: [
    //   {
    //     host: '127.0.0.1',
    //     port: 7000,
    //   },
    //   {
    //     host: '127.0.0.1',
    //     port: 7001,
    //   },
    //   {
    //     host: '127.0.0.1',
    //     port: 7002,
    //   },
    //   {
    //     host: '127.0.0.1',
    //     port: 7003,
    //   },
    //   {
    //     host: '127.0.0.1',
    //     port: 7004,
    //   },
    //   {
    //     host: '127.0.0.1',
    //     port: 7005,
    //   },
    // ],
  },
};

exports.keys = '123';
