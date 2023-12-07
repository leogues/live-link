require('dotenv').config()

import express from 'express'
import { MemoryStore } from 'express-session'
import { Server } from 'socket.io'

import http from 'http'

import { configureMiddleware } from './middlewareConfig'
import { configureWebSocket } from './websocketConfig'
import { frontendUrl } from './routes'
import { roomHandler } from './websocket/room'
import { streamHandler } from './websocket/stream'
import { webrtcCallHandler } from './websocket/webrtcCall'
import { InMemoryPeerRepository } from './repositories/InMemory/InMemoryPeerRepository'
import { ActiveRoomService } from './services/ActiveRoomService'

import { ActiveRoomManagerService } from './services/ActiveRoomManagerService'
import { InMemoryMessageRepository } from './repositories/InMemory/InMemoryMessageRepository'

const sessionStore = new MemoryStore()

export const app = express()

configureMiddleware(app, sessionStore)

export const server = http.createServer(app)

export const socket = new Server(server, {
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
  console.log('user is connected')

  roomHandler(socket, activeRoomManagerService)
  webrtcCallHandler(socket, activeRoomManagerService)
  streamHandler(socket, activeRoomManagerService)

  socket.on('disconnect', () => {
    console.log('user is disconnected')
  })
})
