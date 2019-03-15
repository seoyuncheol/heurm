const Account = require("models/account");
const Post = require("models/post");
const Joi = require("joi");
const ObjectId = require("mongoose").Types.ObjectId;
const redis = require("redis");
const publisher = redis.createClient();

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

  let post;
  try {
    post = await Post.write({
      count,
      username: user.profile.username,
      content
    });
    await account.increaseThoughtCount();
  } catch (e) {
    ctx.throw(500, e);
  }

  // post 에 liked 값 false로 설정
  post = post.toJSON();
  delete post.likes;
  post.liked = false;

  /* 포스트 정보 반환 */
  ctx.body = post;

  /* 데이터를 리덕스 액션 형식으로 전송 */
  publisher.publish(
    "posts",
    JSON.stringify({ type: "posts/RECEIVE_NEW_POST", payload: post })
  );
};

exports.list = async ctx => {
  const { cursor, username } = ctx.query;

  // ObjectId 검증
  if (cursor && !ObjectId.isValid(cursor)) {
    ctx.status = 400; // bad request
    return;
  }

  // API 를 호출한 유저의 정보
  const { user } = ctx.request;
  const self = user ? user.username : null;

  let posts = null;
  try {
    posts = await Post.list({ cursor, username, self });
  } catch (e) {
    ctx.throw(500, e);
  }

  const next =
    posts.length === 20
      ? `/api/posts/?${username ? `username=${username}&` : ""}cursor=${
          posts[19]._id
        }`
      : null;

  // 좋아요 했는지 확인
  function checkLiked(post) {
    // poosts 스키마에 속하지 않는 값을 추가해주려면 toObject()를 해주어야한다.
    // 혹은, 쿼리를 하게 될 때, .lean().exec() 의 형식으로 해야한다.
    post = post.toObject();
    const checked = Object.assign(post, {
      liked: user !== null && post.likes.length > 0
    });
    delete checked.likes; // likes key 제거
    return checked;
  }

  posts = posts.map(checkLiked); // map을 통해서 각 포스트를 변형시켜준다.

  ctx.body = {
    next,
    data: posts
  };
};
