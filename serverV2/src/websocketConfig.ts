import cookieParser from 'cookie-parser'

const passportSocketIo = require('passport.socketio')

import { MemoryStore } from 'express-session'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export const configureWebSocket = (
  socket: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  store: MemoryStore
) => {
  socket.use(
    passportSocketIo.authorize({
      cookieParser: cookieParser,
      key: 'connect.sid',
      secret: process.env.SESSION_SECRET || '',
      store,
    })
  )
}
