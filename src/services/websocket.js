class WebSocketService {
  constructor() {
    this.ws = null;
    this.callbacks = new Map();
  }

  connect() {
    this.ws = new WebSocket("ws://your-websocket-server-url");

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    this.ws.onmessage = (event) => {
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
      // 재연결 로직 추가 가능
      setTimeout(() => this.connect(), 3000);
    };
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
    }
  }
}

export const wsService = new WebSocketService();
