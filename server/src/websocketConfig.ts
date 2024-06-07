import cookieParser from "cookie-parser";
import { MemoryStore } from "express-session";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const passportSocketIo = require('passport.socketio')

export const configureWebSocket = (
  socket: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  store: MemoryStore
) => {
  socket.use(
    passportSocketIo.authorize({
      cookieParser,
      key: 'connect.sid',
      secret: process.env.SESSION_SECRET || '',
      store,
    })
  )
}
