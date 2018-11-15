'use strict';

const mock = require('egg-mock');

describe('test/framework.test.js', () => {

  describe('redis sentinel mode', () => {
    let app;
    before(() => {
      app = mock.app({
        baseDir: 'example',
        framework: true,
      });
      return app.ready();
    });

    after(() => app.close());

    afterEach(mock.restore);

    it('should GET /redis', () => {
      return app.httpRequest()
        .get('/redis')
        .expect('bar');
    });

  });
});

