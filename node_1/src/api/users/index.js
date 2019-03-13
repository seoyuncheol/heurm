const Router = require("koa-router");
const users = new Router();
const userCtrl = require("./user.ctrl");

users.get("/:username", userCtrl.getProfile);
users.get("/:username/thumbnail", userCtrl.getThumbnail);

module.exports = users;
