"use strict";

const Controller = require("egg").Controller;

class ShareController extends Controller {
  async list() {
    const { ctx, app } = this;
    const data = await app.mysql.select("share_data");
    ctx.body = JSON.stringify(data);
  }

  async addShare() {
    const { ctx, app } = this;
    const isExist = await app.mysql.get("share_data", {
      shareKey: ctx.request.body.shareKey,
    });
    if (isExist) {
      ctx.body = JSON.stringify("资源已存在");
      ctx.status = 500;
      return;
    }
    const data = await app.mysql.insert("share_data", {
      shareKey: ctx.request.body.shareKey,
      shareRemark: ctx.request.body.shareRemark,
      shareUrl: ctx.request.body.shareUrl,
      sharePsw: ctx.request.body.sharePsw,
    });
    ctx.body = JSON.stringify(data);
  }

  async updateShare() {
    const { ctx, app } = this;

    const data = await app.mysql.update("share_data", {
      id: ctx.request.body.id,
      shareKey: ctx.request.body.shareKey,
      shareRemark: ctx.request.body.shareRemark,
      shareUrl: ctx.request.body.shareUrl,
      sharePsw: ctx.request.body.sharePsw,
    });
    ctx.body = JSON.stringify(data);
  }

  async deleteShare() {
    const { ctx, app } = this;

    const res = await app.mysql.delete("share_data", {
      id: ctx.request.body.id,
    });
    if (res) {
      ctx.body = JSON.stringify("删除成功");
    } else {
      ctx.body = JSON.stringify("删除失败");
      ctx.status = 500;
    }
  }

  async queryShare() {
    const { ctx, app } = this;
    const res = await app.mysql.get("share_data", {
      shareKey: ctx.query.shareKey,
    });
    if (res && res.shareKey === ctx.query.shareKey) {
      ctx.body = JSON.stringify(res);
    } else {
      ctx.body = JSON.stringify(res);
      ctx.status = 500;
    }
  }
}

module.exports = ShareController;
