"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async login() {
    const { ctx, app } = this;
    const data = ctx.request.body;
    if (data.account === "admin" && data.password === "123") {
      const token = app.jwt.sign(
        {
          account: data.account,
        },
        app.config.jwt.secret
      );
      ctx.body = JSON.stringify(token);
    }
  }
}

module.exports = HomeController;
