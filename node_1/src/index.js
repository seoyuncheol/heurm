require("dotenv").config();
const Koa = require("koa");
const { jwtMiddleware } = require("lib/token");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const app = new Koa();
const router = new Router();
const api = require("./api");
// 미들웨어란 사용자의 요청이 들어왔을때 실행되는 하나의 함수.

router.use("/api", api.routes());

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch(e => {
    console.log(e);
  });

app.use(bodyParser());
app.use(jwtMiddleware);
app.use(router.routes());
app.use(router.allowedMethods()); // router 에서 사용되는 함수를 허용해주겠다.

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening to ${port} port`);
});
