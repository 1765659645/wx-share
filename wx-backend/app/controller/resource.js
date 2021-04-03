"use strict";

const Controller = require("egg").Controller;
const qs = require("querystring");

class ResourceController extends Controller {
  async index() {
    const { ctx, app } = this;
    // const data = ctx.request.body;
    const key = ctx.query.key;
    const currentPage = ctx.query.page;
    const pageSize = ctx.query.pageSize;
    const params = {};
    params["appKey"] = "IVYZJVc10wUs";
    params["openId"] = "4xEokBpAFoQZd100";

    //变动部分
    params["q"] = key;
    params["currentPage"] = currentPage;
    params["pageSize"] = pageSize;
    const data = await ctx.curl(
      `http://api.xiaocongjisuan.com/data/skydriverdata/get?${qs.stringify(
        params
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    );
    ctx.body = data.data.toString();
  }
}

module.exports = ResourceController;
