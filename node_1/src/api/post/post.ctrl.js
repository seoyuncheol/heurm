const Account = require("models/account");
const Post = require("models/post");
const Joi = require("joi");
const ObjectId = require("mongoose").Types.ObjectId;

exports.write = async ctx => {
  /* 유저 검증하기 */
  const { user } = ctx.request;
  if (!user) {
    // 비로그인 에러
    ctx.status = 403;
    ctx.body = { message: " not logged in" };
    return;
  }

  /* 유저의 thoughtCount */
  let account;
  try {
    account = await Account.findById(user._id).exec();
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!account) {
    ctx.status = 403;
    return;
  }

  const count = account.thoughtCount + 1;

  const schema = Joi.object().keys({
    content: Joi.string()
      .min(5)
      .max(1000)
      .required()
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    status = 400; // bad request
    return;
  }

  const { content } = ctx.request.body;

  console.log(content);

  let post;
  try {
    post = await Post.write({
      count,
      username: user.profile.username,
      content
    });
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.body = post;

  // todo : 소켓을 통하여 접속중인 유저에게 실시간 포스트 정보 전송
};

exports.list = async ctx => {
  const { cursor, username } = ctx.query;

  if (cursor && !ObjectId.isValid(cursor)) {
    ctx.status = 400; // bad request
    return;
  }

  let posts = null;
  try {
    posts = await Post.list({ cursor, username });
  } catch (e) {
    ctx.throw(500, e);
  }

  const next =
    posts.length === 20
      ? `/api/posts/?${username ? `username=${username}&` : ""}cursor=${
          posts[19]._id
        }`
      : null;

  ctx.body = {
    next,
    data: posts
  };
};
