'use strict';

const mock = require('egg-mock');
const assert = require('assert');
const ioc = require('socket.io-client');

describe('test/framework.test.js', () => {

  describe('egg-redis', () => {
    let app;
    before(() => {
      app = mock.app({
        baseDir: 'apps/halo-redis',
        framework: true,
      });
      return app.ready();
    });

    after(() => app.close());

    afterEach(mock.restore);

    it('should redis sentinel mode work', () => {
      return app.httpRequest()
        .get('/')
        .expect('bar');
    });

  });

  describe('egg-socket.io', () => {
    it('should egg-socket.io works', done => {
      const app = mock.cluster({
        baseDir: 'apps/halo-socket.io',
        framework: true,
        workers: 2,
        sticky: true,
      });
      app.ready().then(() => {
        const socket = ioc('http://127.0.0.1:17001');
        socket.on('connect', () => socket.emit('chat', ''));
        socket.on('disconnect', () => app.close().then(done, done));
        socket.on('res', msg => {
          assert(msg === 'hello');
          socket.close();
        });
      });
    });

  });

});

