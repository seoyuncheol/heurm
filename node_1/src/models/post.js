const mongoose = require("mongoose");
const { Schema } = mongoose;

const Comment = new Schema({
  createdAt: { type: Date, default: Date.now },
  username: String,
  text: String
});

const Post = new Schema({
  createdAt: { type: Date, default: Date.now },
  count: Number,
  username: String,
  content: String,
  likesCount: { type: Number, default: 0 },
  likes: { type: [String], default: [] },
  comments: {
    type: [Comment],
    default: []
  }
});

Post.statics.write = function({ count, username, content }) {
  const post = new this({
    count,
    username,
    content
  });
  return post.save();
};

Post.statics.list = function({ cursor, username, self }) {
  const query = Object.assign(
    {},
    cursor ? { _id: { $lt: cursor } } : {},
    username ? { username } : {}
  );
  const projection = self
    ? {
        const: 1,
        username: 1,
        content: 1,
        comments: 1,
        likes: {
          $elemMatch: { $eq: self }
        },
        likesCount: 1,
        createdAt: 1
      }
    : {};

  return this.find(query, projection)
    .sort({ _id: -1 })
    .limit(20)
    .exec();
};

Post.statics.like = function({ _id, username }) {
  return this.findByIdAndUpdate(
    _id,
    {
      $inc: { likesCount: 1 },
      $push: { likes: username }
    },
    {
      new: true,
      select: "likeCount"
    }
  ).exec();
};

Post.statics.unlike = function({ _id, username }) {
  return this.findByIdAndUpdate(
    _id,
    {
      $inc: { likesCount: -1 },
      $pull: { likes: username }
    },
    {
      new: true,
      select: "likeCount"
    }
  ).exec();
};

module.exports = mongoose.model("Post", Post);
