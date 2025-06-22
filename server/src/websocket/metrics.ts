import { Socket } from "socket.io/dist";
import { SOCKET_MESSAGES } from "../metrics";
import { SOCKET_ACTIVE } from "../metrics";
import { SOCKET_CONNECTIONS } from "../metrics";

export const metricsHandler = (socket: Socket) => {
  SOCKET_CONNECTIONS.inc({ service: "live-link" });
  SOCKET_ACTIVE.inc({ service: "live-link" });

  socket.onAny((event, ..._args) => {
    SOCKET_MESSAGES.inc({ event, service: "live-link" });
  });

  socket.on("disconnect", () => {
    SOCKET_ACTIVE.dec({ service: "live-link" });
  });
};
