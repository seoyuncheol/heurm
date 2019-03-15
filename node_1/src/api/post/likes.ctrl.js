const Post = require("models/post");

exports.like = async ctx => {
  /* 로그인 확인 */
  const { user } = ctx.request;
  if (!user) {
    ctx.stautus = 403;
    return;
  }

  /* 포스트 찾기 */
  const { postId } = ctx.params;
  const { username } = user.profile;

  let post = null;
  try {
    post = await Post.findById(postId, {
      likesCount: 1,
      likes: {
        $elemMatch: { $eq: username }
      }
    });
  } catch (e) {
    ctx.throw(500, e);
  }

  /* 업데이트 */
  try {
    post = await Post.like({
      _id: postId,
      username: username
    });
  } catch (e) {
    ctx.throw(500, e);
  }

  /* 좋아요 관련정보 반환 */
  ctx.body = {
    liked: true,
    likesCount: post.likesCount
  };
};

exports.unlike = async ctx => {
  /*  로그인 확인 */
  const { user } = ctx.request;
  if (!user) {
    ctx.status = 403;
    return;
  }

  /* 포스트 찾기 */
  const { postId } = ctx.parmas;
  const { username } = user.profile;

  let Post = null;

  try {
    post = await Post.findById(postId, {
      likesCount: 1,
      likes: {
        $elemMatch: { $eq: username }
      }
    });
  } catch (e) {
    ctx.throw(500, e);
  }

  // 이미 좋아요. 하지 않은 상태면 기본값 반환
  if (post.likes.length === 0) {
    ctx.body = {
      liked: false,
      likesCount: post.likesCount
    };
    return;
  }

  /* 업데이트 */
  try {
    post = await Post.unlike({
      _id: postId,
      username: username
    });
  } catch (e) {
    throw (500, e);
  }

  ctx.body = {
    liked: false,
    likesCount: post.likesCount
  };
};
