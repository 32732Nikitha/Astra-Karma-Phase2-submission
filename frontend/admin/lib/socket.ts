export const connectSocket = (cb: any) => {
  const ws = new WebSocket("ws://localhost:8000/ws/events");

  ws.onmessage = (e) => {
    cb(e.data);
  };

  return ws;
};