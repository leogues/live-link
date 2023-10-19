import socketIO from "socket.io-client";
import baseUrl from "./apiUrl";

const WS = baseUrl;

export const ws = socketIO(WS, {
  transports: ["websocket"],
  withCredentials: true,
});
