"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/", controller.home.index);
  router.get("/list", controller.share.list);
  router.post("/addShare", controller.share.addShare);
  router.put("/updateShare", controller.share.updateShare);
  router.delete("/deleteShare", controller.share.deleteShare);
  router.get("/queryShare", controller.share.queryShare);
};
