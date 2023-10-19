import { User } from '.prisma/client'
import { Socket } from 'socket.io'

const rooms: Record<string, Record<string, IUser>> = {}
const chats: Record<string, IMessage[]> = {}
interface IUser {
  id: string
  name: string
  lastname?: string | null
  isMuted: boolean
  isSharingScreen: boolean
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
  author?: string
  timestamp: number
}

export const roomHandler = (socket: Socket) => {
  const joinRoom = ({ roomId }: IJoinRoomParams) => {
    const sessionUser = socket.request.user as User

    if (!rooms[roomId]) rooms[roomId] = {}

    //socket.emit('get-messages', chats[roomId])

    const user: IUser = {
      id: sessionUser.id,
      name: sessionUser.name,
      lastname: sessionUser.lastName,
      isMuted: false,
      isSharingScreen: false,
    }

    rooms[roomId][user.id] = user

    socket.join(roomId)

    socket.to(roomId).emit('user-joined', user)

    socket.emit('get-users', {
      roomId,
      participants: rooms[roomId],
    })

    socket.on('disconnect', () => {
      console.log('user left the room: ', user.id, ' ', user.name)
      leaveRoom({ roomId, userId: user.id })
    })
  }

  const leaveRoom = ({ roomId, userId }: IRoomParams) => {
    if (rooms[roomId] && rooms[roomId][userId]) {
      delete rooms[roomId][userId]
    }
    socket.to(roomId).emit('user-disconnected', userId)
  }

  const startSharing = ({ userId, roomId }: IRoomParams) => {
    console.log({ roomId, userId })
    socket.to(roomId).emit('user-started-sharing', userId)
  }

  const stopSharing = (roomId: string) => {
    socket.to(roomId).emit('user-stopped-sharing')
  }

  const addMessage = (roomId: string, message: IMessage) => {
    console.log({ message })
    if (chats[roomId]) {
      chats[roomId].push(message)
    } else {
      chats[roomId] = [message]
    }
    socket.to(roomId).emit('add-message', message)
  }

  socket.on('join-room', joinRoom)
  socket.on('start-sharing', startSharing)
  socket.on('stop-sharing', stopSharing)
  socket.on('send-message', addMessage)
}
