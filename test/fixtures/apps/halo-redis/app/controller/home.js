'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

  async index() {
    const { ctx, app } = this;
    await app.redis.set('foo', 'bar');
    ctx.body = await app.redis.get('foo');
  }
}

module.exports = HomeController;
