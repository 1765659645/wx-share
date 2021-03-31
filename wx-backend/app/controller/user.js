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
      ctx.body = JSON.stringify({ token, currentUser: { account: "admin" } });
    } else if (data.account !== "admin" || data.password !== "123") {
      ctx.body = JSON.stringify("用户名或密码错误");
      ctx.status = 401;
    }
  }
}

module.exports = HomeController;
