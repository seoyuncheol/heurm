const Joi = require("joi");
const Account = require("models/account");

// 로컬 회원가입
exports.localRegister = async ctx => {
  const schema = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(4)
      .max(15)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(4)
  });
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    return;
  }

  // 아이디 / 이메일 중복 체크
  let existing = null;
  try {
    existing = await Account.findByEmailOrUsername(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (existing) {
    ctx.status = 400;
    ctx.body = {
      key: existing.email === ctx.request.body.email ? "email" : "useranme"
    };
    return;
  }

  // 계정생성
  let account = null;
  try {
    account = await Account.localRegister(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  // 토큰생성
  let token = null;

  try {
    token = await account.generateToken();
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.cookies.set("access_token", token, {
    httpOnly: true,
    maxAage: 1000 * 60 * 60 * 24 * 7
  });

  console.log(account.profile);

  ctx.body = account.profile;
};

// 로컬 로그인
exports.localLogin = async ctx => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  const { email, password } = ctx.request.body;
  let account = null;

  try {
    account = await Account.findByEmail(email);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!account || !account.validatePassword(password)) {
    ctx.status = 403; // Forbidden
    return;
  }

  let token = null;

  try {
    token = await account.generateToken();
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.cookies.set("access_token", token, {
    httpOnly: true,
    maxAage: 1000 * 60 * 60 * 24 * 7
  });
  ctx.body = account.profile;
};

// 이메일 / 아이디 존재유무 확인
exports.exists = async ctx => {
  const { key, value } = ctx.params;
  let account = null;
  try {
    account = await (key === "email"
      ? Account.findByEmail(value)
      : Account.findByUsername(value));
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = {
    exists: account !== null
  };
};

// 로그아웃
exports.logout = async ctx => {
  ctx.cookies.set("access_token", null, {
    maxAage: 0,
    httpOnly: true
  });
  ctx.status = 204;
};

exports.check = ctx => {
  const { user } = ctx.request;
  if (!user) {
    ctx.status = 403; // Forbidden
    return;
  }

  ctx.body = user.profile;
};
