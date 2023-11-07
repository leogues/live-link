import express from 'express'
import session, { MemoryStore } from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'
const passportSocketIo = require('passport.socketio')

require('dotenv').config()
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { roomHandler } from './websocket/room'
import { webrtcCallHandler } from './websocket/webrtcCall'
import { frontendUrl, routes } from './routes'
import { streamHandler } from './websocket/stream'

const port = 8080
const app = express()

const sessionStore = new MemoryStore()

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
)

app.use(
  session({
    secret: process.env.SESSION_SECRET || '',
    cookie: {
      maxAge: 60000 * 60 * 24 * 1,
    },
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
  })
)

app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(routes)

const server = http.createServer(app)

const socket = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

socket.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'connect.sid',
    secret: process.env.SESSION_SECRET || '',
    store: sessionStore,
  })
)

socket.on('connection', (socket) => {
  console.log('user is connected')

  roomHandler(socket)
  webrtcCallHandler(socket)
  streamHandler(socket)

  socket.on('disconnect', () => {
    console.log('user is disconnected')
  })
})

server.listen(port, () => {
  console.log(`Listening to the server on ${port}`)
})
