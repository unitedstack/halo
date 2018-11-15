'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const data = await this.service.test.get(123);
    this.ctx.body = data.name;
  }

  async redis() {
    const { ctx, app } = this;
    await app.redis.set('foo', 'bar');
    ctx.body = await app.redis.get('foo');
  }
}

module.exports = HomeController;
