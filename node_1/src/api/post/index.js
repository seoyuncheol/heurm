const Router = require("koa-router");
const post = new Router();

const postCtrl = require("./post.ctrl");

post.post("/", postCtrl.write);
post.get("/", postCtrl.list);

module.exports = post;
