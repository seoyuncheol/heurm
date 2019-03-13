const Router = require("koa-router");
const auth = require("./auth");
const post = require("./post");
const users = require("./users");
const api = new Router();

api.use("/auth", auth.routes());
api.use("/posts", post.routes());
api.use("/users", users.routes());

module.exports = api;
