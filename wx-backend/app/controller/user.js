"use strict";

const Controller = require("egg").Controller;
const crypto = require("crypto");

class HomeController extends Controller {
  async login() {
    const { ctx, app } = this;
    const data = ctx.request.body;

    if (data.account && data.password) {
      const sqlAccount = await app.mysql.get("share_user", {
        account: ctx.request.body.account,
      });
      const sqlAccountInfo = JSON.parse(JSON.stringify(sqlAccount));
      if (sqlAccountInfo && sqlAccountInfo.account && sqlAccountInfo.password) {
        const password = crypto
          .createHash("md5")
          .update(ctx.request.body.password)
          .digest("hex");
        if (
          ctx.request.body.account === sqlAccountInfo.account &&
          password === sqlAccountInfo.password
        ) {
          const token = app.jwt.sign(
            {
              account: data.account,
            },
            app.config.jwt.secret
          );
          ctx.body = JSON.stringify({
            token,
            currentUser: { account: sqlAccountInfo.account },
          });
        } else {
          ctx.body = JSON.stringify("用户名或密码错误");
          ctx.status = 401;
        }
      } else {
        ctx.body = JSON.stringify("用户名或密码错误");
        ctx.status = 401;
      }
    }
  }
}

module.exports = HomeController;
