import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import Root from "./Root";
import configureStore from "./redux/configureStore";
import socket from "lib/socket";

const store = configureStore();
// 개발환경에선 localhost:4000 에 연결하고, 프로덕션에선 현재 호스트에 알맞는 프로토콜로 접속합니다
const socketURI =
  process.env.NODE_ENV === "production"
    ? (window.location.protocol === "https:" ? "wss://" : "ws://") +
      window.location.host +
      "/ws"
    : "ws://localhost:4000/ws";

socket.initialize(store, socketURI);
ReactDOM.render(<Root store={store} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
