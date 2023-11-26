import { User } from '.prisma/client'
import { Socket } from 'socket.io'

export const rooms: Record<string, Record<string, IPeer>> = {}
const chats: Record<string, IMessage[]> = {}
export const userSocketMap: Record<string, string> = {}

interface IUser {
  id: string
  name: string
  lastName?: string | null
  picture: string | null
}

export interface IPeer {
  user: IUser
  isMicOn?: boolean
  isWebCamOn?: boolean
  isSharingScreenOn?: boolean
}

interface IRoomParams {
  roomId: string
  userId: string
}

interface IJoinRoomParams extends IRoomParams {
  userName: string
}
interface IMessage {
  content: string
  userId: string
  name: string
  lastName?: string
  picture: string
  timestamp: number
}

export const roomHandler = (socket: Socket) => {
  const joinRoom = async ({ roomId }: IJoinRoomParams) => {
    const sessionUser = socket.request.user as User

    if (!rooms[roomId]) rooms[roomId] = {}
    if (!chats[roomId]) chats[roomId] = []

    userSocketMap[sessionUser.id] = socket.id

    socket.emit('get-messages', chats[roomId])

    console.log('User:', sessionUser.name, 'Join:', roomId)

    const peer: IPeer = {
      user: {
        id: sessionUser.id,
        name: sessionUser.name,
        lastName: sessionUser.lastName,
        picture: sessionUser.picture,
      },
      isMicOn: false,
      isWebCamOn: false,
      isSharingScreenOn: false,
    }

    rooms[roomId][sessionUser.id] = peer

    socket.join(roomId)

    socket.to(roomId).emit('user-joined', peer)
    socket.to(roomId).emit('call-new-user', peer)

    socket.emit('get-users', {
      roomId,
      participants: rooms[roomId],
    })

    socket.on('disconnect', () => {
      console.log('user left the room: ', peer.user.id, ' ', peer.user.name)
      leaveRoom({ roomId, userId: peer.user.id })
    })
  }

  const leaveRoom = ({ roomId }: IRoomParams) => {
    const sessionUser = socket.request.user as User

    if (rooms[roomId] && rooms[roomId][sessionUser.id]) {
      delete rooms[roomId][sessionUser.id]
    }

    if (userSocketMap[sessionUser.id]) {
      delete userSocketMap[sessionUser.id]
    }

    socket.to(roomId).emit('user-disconnected', sessionUser.id)
    socket.to(roomId).emit('end-call', sessionUser.id)
  }

  const addMessage = (roomId: string, message: IMessage) => {
    if (!chats[roomId]) chats[roomId] = []

    chats[roomId].push(message)

    socket.to(roomId).emit('add-message', message)
  }

  socket.on('join-room', joinRoom)
  socket.on('leave-room', leaveRoom)
  socket.on('send-message', addMessage)
}
