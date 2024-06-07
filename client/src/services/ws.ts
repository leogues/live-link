import { io } from "socket.io-client";

import baseUrl from "./apiUrl";

const WS = baseUrl.replace("/api", "");

export const ws = io(WS, {
  transports: ["websocket"],
  path: "/api/socket.io/",
  withCredentials: true,
});
