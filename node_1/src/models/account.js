const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");
const { generateToken } = require("lib/token");

function hash(password) {
  return crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(password)
    .digest("hex");
}

const Account = new Schema({
  profile: {
    username: String,
    thumbnail: { type: String, default: "/static/images/default_thumbnail.png" }
  },
  email: String,
  social: {
    facebook: {
      id: String,
      accessToken: String
    },
    google: {
      id: String,
      accessToken: String
    }
  },

  password: String, // 로컬계정의 경우엔 비밀번호를 해싱해서 저장합니다
  thoughtCount: { type: Number, default: 0 }, // 서비스에서 포스트를 작성 할 때마다 1씩 올라갑니다
  createdAt: { type: Date, default: Date.now }
});

Account.statics.findByUsername = function(username) {
  return this.findOne({ "profile.username": username }).exec();
};

Account.statics.findByEmail = function(email) {
  return this.findOne({ email }).exec();
};

Account.statics.findByEmailOrUsername = function({ username, email }) {
  return this.findOne({
    // $or 연산자를 통해 둘중에 하나를 만족하는 데이터를 찾습니다
    $or: [{ "profile.username": username }, { email }]
  }).exec();
};

Account.statics.localRegister = function({ username, email, password }) {
  const account = new this({
    profile: {
      username
    },
    email,
    password: hash(password)
  });

  return account.save();
};

Account.methods.validatePassword = function(password) {
  const hashed = hash(password);
  return this.password === hashed;
};

Account.methods.generateToken = function() {
  const payload = {
    _id: this._id,
    profile: this.profile
  };

  return generateToken(payload);
};
Account.methods.increaseThoughtCount = function() {
  this.thoughtCount++;
  return this.save();
};
module.exports = mongoose.model("Account", Account);
