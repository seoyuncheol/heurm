const Router = require("koa-router");
const post = new Router();

const postCtrl = require("./post.ctrl");
const likesCtrl = require("./likes.ctrl");
const commentsCtrl = require("./commentsCtrl");

post.post("/", postCtrl.write);
post.get("/", postCtrl.list);
post.post("/:postId/likes", likesCtrl.like);
post.delete("/:postId/likes", likesCtrl.unlike);
post.post("/:postId/commnets", commentsCtrl.comment);

module.exports = post;
