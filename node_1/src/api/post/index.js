const Router = require("koa-router");
const post = new Router();

const postCtrl = require("./post.ctrl");
const likesCtrl = require("./likes.ctrl");

post.post("/", postCtrl.write);
post.get("/", postCtrl.list);
post.post("/:postId/likes", likesCtrl.like);
post.delete("/:postId/likes", likesCtrl.unlike);

module.exports = post;
