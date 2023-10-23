import { User } from '.prisma/client'
import { Socket } from 'socket.io'

const rooms: Record<string, Record<string, IPeer>> = {}
const chats: Record<string, IMessage[]> = {}
export const userSocketMap: Record<string, string> = {}

interface IUser {
  id: string
  name: string
  lastname?: string | null
  picture: string | null
}

interface IPeer {
  user: IUser
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
  const joinRoom = async ({ roomId }: IJoinRoomParams) => {
    const sessionUser = socket.request.user as User

    if (!rooms[roomId]) rooms[roomId] = {}

    userSocketMap[sessionUser.id] = socket.id
    //socket.emit('get-messages', chats[roomId])

    const peer: IPeer = {
      user: {
        id: sessionUser.id,
        name: sessionUser.name,
        lastname: sessionUser.lastName,
        picture: sessionUser.picture,
      },
      isMuted: false,
      isSharingScreen: false,
    }

    rooms[roomId][sessionUser.id] = peer

    socket.join(roomId)

    socket.to(roomId).emit('user-joined', peer)

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
    console.log(socket.request.user.name)
    const user = socket.request.user

    if (rooms[roomId] && rooms[roomId][user.id]) {
      delete rooms[roomId][user.id]
    }
    if (userSocketMap[user.id]) {
      delete userSocketMap[user.id]
    }

    socket.to(roomId).emit('user-disconnected', user.id)
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
  socket.on('leave-room', leaveRoom)
  socket.on('start-sharing', startSharing)
  socket.on('stop-sharing', stopSharing)
  socket.on('send-message', addMessage)
}
