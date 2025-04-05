class WebSocketService {
  constructor() {
    this.ws = null;
    this.callbacks = new Map();
  }

  connect(openCallback, closeCallback) {
    this.ws = new WebSocket("ws://localhost:12002/ws/ip-geo");

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
      openCallback();
    };

    this.ws.onmessage = (event) => {
      console.log("message coming from router ", event);
      const data = JSON.parse(event.data);
      if (data.type && this.callbacks.has(data.type)) {
        this.callbacks.get(data.type)(data);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket Disconnected");
      this.disconnect();
      closeCallback();
      // 재연결 로직 추가 가능
      //   setTimeout(() => this.connect(), 3000);
    };
  }

  sendMessage(message) {
    console.log("message to router ", message);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      throw new Error("WebSocket is not connected");
    }
  }

  sendSignedTransaction(signedTx) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "SIGNED_TRANSACTION",
          data: {
            signedTx: signedTx.serialize().toString("base64"),
          },
        })
      );
    } else {
      throw new Error("WebSocket is not connected");
    }
  }

  on(type, callback) {
    this.callbacks.set(type, callback);
  }

  searchIpLocation(ip) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "IP_LOCATION_REQUEST",
          data: { ip },
        })
      );
    } else {
      throw new Error("WebSocket is not connected");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.callbacks = new Map();
    }
  }
}

export const wsService = new WebSocketService();
