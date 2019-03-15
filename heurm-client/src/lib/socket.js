const parseJSON = str => {
  let parsed = null;
  try {
    parsed = JSON.parse(str);
  } catch (e) {
    return null;
  }
  return parsed;
};

export default (function socketHelper() {
  let _store = null;
  let _socket = null;
  let _uri = null;

  const listener = message => {
    const data = parseJSON(message.data); // JSON 파싱

    console.log("data : " + message.data);

    if (!data || !data.type) return; // 파싱 실패했더나,  type 값이 없으면 무시
    _store.dispatch(data);
  };

  const reconnect = () => {
    // 연결이 끊겼을 때 3초마다 재연결
    console.log("reconnecting");
    setTimeout(() => connect(_uri), 3000);
  };

  const connect = uri => {
    console.log(uri);

    _uri = uri;
    _socket = new WebSocket(uri);
    _socket.onmessage = listener;
    _socket.onopen = event => {
      console.log("connected to " + uri);
    };
    _socket.onclose = reconnect;
  };

  return {
    initialize: (store, uri) => {
      _store = store;
      connect(uri);
    }
  };
})();
