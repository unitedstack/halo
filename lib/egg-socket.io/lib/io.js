'use strict';

const http = require('http');
const assert = require('assert');
const is = require('is-type-of');
const redisAdapter = require('socket.io-redis');
const { utils } = require('egg-core');
const compose = require('koa-compose');
const debug = require('debug')('egg-socket.io:lib:io.js');

const loader = require('./loader');
const packetMiddlewareInit = require('./packetMiddlewareInit');
const connectionMiddlewareInit = require('./connectionMiddlewareInit');

const CtxEventSymbol = Symbol.for('EGG-SOCKET.IO#CTX-EVENT');
const RouterConfigSymbol = Symbol.for('EGG-SOCKET.IO#ROUTERCONFIG');

module.exports = app => {
  loader(app);
  const config = app.config.io;

  debug('[egg-socket.io] init start!');

  const namespace = config.namespace;

  app.beforeStart(async () => {
    for (const nsp in namespace) {
      const connectionMiddlewareConfig = namespace[nsp].connectionMiddleware;
      const packetMiddlewareConfig = namespace[nsp].packetMiddleware;

      debug('[egg-socket.io] connectionMiddlewareConfig: ', connectionMiddlewareConfig);
      debug('[egg-socket.io] packetMiddlewareConfig: ', packetMiddlewareConfig);

      let connectionMiddlewares = [];
      let packetMiddlewares = [];

      if (connectionMiddlewareConfig) {
        assert(is.array(connectionMiddlewareConfig), 'config.connectionMiddleware must be Array!');
        for (const middleware of connectionMiddlewareConfig) {
          assert(app.io.middleware[middleware], `can't find middleware: ${middleware} !`);
          connectionMiddlewares.push(app.io.middleware[middleware]);
        }
      }

      if (packetMiddlewareConfig) {
        assert(is.array(packetMiddlewareConfig), 'config.packetMiddleware must be Array!');
        for (const middleware of packetMiddlewareConfig) {
          assert(app.io.middleware[middleware], `can't find middleware: ${middleware} !`);
          packetMiddlewares.push(app.io.middleware[middleware]);
        }
      }

      debug('[egg-socket.io] initNsp: %s', nsp);

      const sessionMiddleware = app.middleware.filter(mw => {
        return mw._name && mw._name.startsWith('session');
      })[0];

      connectionMiddlewares.unshift(sessionMiddleware);
      connectionMiddlewares = connectionMiddlewares.map(mw => utils.middleware(mw));
      connectionMiddlewares = compose(connectionMiddlewares);

      packetMiddlewares.unshift(sessionMiddleware);
      packetMiddlewares = packetMiddlewares.map(mw => utils.middleware(mw));
      packetMiddlewares = compose(packetMiddlewares);

      debug('[egg-socket.io] connectionMiddlewares: ', connectionMiddlewares);
      debug('[egg-socket.io] packetMiddlewares: ', packetMiddlewares);
      initNsp(app.io.of(nsp), connectionMiddlewares, packetMiddlewares);
    }
  });

  const errorEvent = {
    disconnect: 1,
    error: 1,
    disconnecting: 1,
  };

  function initNsp(nsp, connectionMiddlewares, packetMiddlewares) {
    nsp.on('connection', socket => {
      socket.use((packet, next) => {
        packetMiddlewareInit(app, socket, packet, next, packetMiddlewares, nsp);
      });

      if (nsp[RouterConfigSymbol]) {
        for (const [ event, handler ] of nsp[RouterConfigSymbol].entries()) {
          if (errorEvent[event]) {
            socket.on(event, (...args) => {
              debug('[egg-socket.io] socket closed:', args);
              const request = socket.request;
              request.socket = socket;
              const ctx = app.createContext(request, new http.ServerResponse(request));
              ctx.args = args;
              handler.call(ctx)
                .catch(e => {
                  e.message = '[egg-socket.io] controller execute error: ' + e.message;
                  app.coreLogger.error(e);
                });
            });
          } else {
            socket.on(event, (...args) => {
              const ctx = args.splice(-1)[0];
              ctx.args = ctx.req.args = args;
              handler.call(ctx)
                .then(() => ctx[CtxEventSymbol].emit('finshed'))
                .catch(e => {
                  if (e instanceof Error) {
                    e.message = '[egg-socket.io] controller execute error: ' + e.message;
                  } else /* istanbul ignore next */ {
                    debug(e);
                  }
                  ctx[CtxEventSymbol].emit('finshed', e);
                });
            });
          }
        }
      }
    });

    nsp.use((socket, next) => {
      connectionMiddlewareInit(app, socket, next, connectionMiddlewares);
    });
  }

  if (config.redis) {
    const redisConfig = config.redis;
    if (redisConfig.cluster) {
      assert(redisConfig.nodes && Array.isArray(redisConfig.nodes), 'Redis cluster config should has a \'nodes\' property  as a array');
      redisConfig.nodes.forEach(node => {
        assert(node.host && node.port, 'Each redis cluster node should has host and port property');
      });
      // Use io-redis to support cluster mode if redis config has 'cluster' property.
      const IORedis = require('ioredis');
      app.io.adapter(redisAdapter({
        pubClient: new IORedis.Cluster(redisConfig.nodes),
        subClient: new IORedis.Cluster(redisConfig.nodes),
      }));
    } else if (redisConfig.sentinels) {
      assert(redisConfig.sentinels && Array.isArray(redisConfig.sentinels), 'Redis sentinel config should has a \'sentinels\' property  as a array');
      redisConfig.sentinels.forEach(sentinel => {
        assert(sentinel.host && sentinel.port, 'Each redis sentinel should has host and port property');
      });
      assert(redisConfig.name, 'Redis sentinel config should has a name property to identify a group of redis instance');
      // Use io-redis to support sentinel mode if redis config has 'sentinels' property.
      const IORedis = require('ioredis');
      app.io.adapter(redisAdapter({
        pubClient: new IORedis(redisConfig),
        subClient: new IORedis(redisConfig),
      }));
    } else {
      app.io.adapter(redisAdapter(redisConfig));
    }
    debug('[egg-socket.io] init socket.io-redis ready!');
  }

  app.on('server', server => {
    app.io.attach(server, config.init);

    // Check whether it's a common function, it shouldn't be
    // an async or generator function, or it will be ignored.
    if (typeof config.generateId === 'function' &&
      !is.asyncFunction(config.generateId) &&
      !is.generatorFunction(config.generateId)) {
      app.io.engine.generateId = config.generateId;
    }

    debug('[egg-socket.io] init ready!');
  });
};
