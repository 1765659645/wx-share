"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, jwt } = app;
  router.get("/", controller.home.index);
  router.get("/list", jwt, controller.share.list);
  router.post("/addShare", jwt, controller.share.addShare);
  router.put("/updateShare", jwt, controller.share.updateShare);
  router.delete("/deleteShare", jwt, controller.share.deleteShare);
  router.get("/queryShare", controller.share.queryShare);
  router.post("/login", controller.user.login);
  router.get("/resource", controller.resource.index);
};
