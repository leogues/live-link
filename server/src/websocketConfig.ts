import { Server } from "socket.io";
import { sessionMiddleware } from "./middlewareConfig";
import passport from "passport";

export const configureWebSocket = (socket: Server) => {
  socket.engine.use(sessionMiddleware);
  socket.engine.use(passport.initialize());
  socket.engine.use(passport.session());
  socket.use((connection, next) => {
    if (connection.request.user) { next(); }
    else { next(new Error("Unauthorized")); }
  });
};
