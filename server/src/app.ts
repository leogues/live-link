require('dotenv').config()

import express from 'express'
import { MemoryStore } from 'express-session'
import http from 'http'
import { Server } from 'socket.io'

import { configureMiddleware } from './middlewareConfig'
import { InMemoryMessageRepository } from './repositories/InMemory/InMemoryMessageRepository'
import { InMemoryPeerRepository } from './repositories/InMemory/InMemoryPeerRepository'
import { frontendUrl } from './routes'
import { ActiveRoomManagerService } from './services/ActiveRoomManagerService'
import { ActiveRoomService } from './services/ActiveRoomService'
import { roomHandler } from './websocket/room'
import { streamHandler } from './websocket/stream'
import { webrtcCallHandler } from './websocket/webrtcCall'
import { configureWebSocket } from './websocketConfig'

const sessionStore = new MemoryStore()

export const app = express()

configureMiddleware(app, sessionStore)

export const server = http.createServer(app)

export const socket = new Server(server, {
  path: '/api/socket.io',
  cors: {
    origin: frontendUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

configureWebSocket(socket, sessionStore)

const activeRoomManagerService = new ActiveRoomManagerService(
  InMemoryPeerRepository,
  InMemoryMessageRepository,
  ActiveRoomService
)

socket.on('connection', (socket) => {
  roomHandler(socket, activeRoomManagerService)
  webrtcCallHandler(socket, activeRoomManagerService)
  streamHandler(socket, activeRoomManagerService)
})
