import { Socket } from "socket.io";
import { SOCKET_MESSAGES } from "../metrics";
import { SOCKET_ACTIVE } from "../metrics";
import { SOCKET_CONNECTIONS } from "../metrics";

export const metricsHandler = (socket: Socket) => {
  SOCKET_CONNECTIONS.add(1);
  SOCKET_ACTIVE.add(1);

  socket.onAny((event, ..._args) => {
    const knownEvents = ["join-room", "leave-room", "send-message", "mediaDeviceStatusUpdate",
      "renegotiate", "candidate", "offer", "answer"];
    SOCKET_MESSAGES.add(1, { event: knownEvents.includes(event) ? event : "other" });
  });

  socket.on("disconnect", () => {
    SOCKET_ACTIVE.add(-1);
  });
};
