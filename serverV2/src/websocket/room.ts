import { Socket } from 'socket.io'
import { IActiveRoomManagerService } from '../interfaces/services/IActiveRoomManagerService'

interface IRoomParams {
  roomId: string
  userId: string
}

interface IJoinRoomParams extends IRoomParams {
  userName: string
}

export const roomHandler = (
  socket: Socket,
  activeRoomManagerService: IActiveRoomManagerService
) => {
  const joinRoom = async ({ roomId }: IJoinRoomParams) => {
    const sessionUser = socket.request.user as User

    activeRoomManagerService.addUserSocket(sessionUser.id, socket.id)

    const room = activeRoomManagerService.getRoom(roomId)
    const roomMessages = room.getAllMessages()

    socket.emit('get-messages', roomMessages)

    console.log('User:', sessionUser.name, 'Join:', roomId)

    const { id, name, lastName, picture } = sessionUser

    const peer: Peer = {
      user: {
        id,
        name,
        lastName,
        picture,
      },
      isMicOn: false,
      isWebCamOn: false,
      isSharingScreenOn: false,
    }

    room.addPeer(sessionUser.id, peer)

    socket.join(roomId)
    socket.to(roomId).emit('user-joined', peer)
    socket.to(roomId).emit('call-new-user', peer)

    const roomParticipants = room.getAllPeers()

    socket.emit('get-users', {
      roomId,
      participants: roomParticipants,
    })

    socket.on('disconnect', () => {
      console.log('user left the room:', peer.user.id, peer.user.name)
      leaveRoom({ roomId, userId: peer.user.id })
    })
  }

  const leaveRoom = ({ roomId }: IRoomParams) => {
    const sessionUser = socket.request.user as User

    const room = activeRoomManagerService.getRoom(roomId)

    room.removePeer(sessionUser.id)

    activeRoomManagerService.removeUserSocket(sessionUser.id)

    socket.to(roomId).emit('user-disconnected', sessionUser.id)
    socket.to(roomId).emit('end-call', sessionUser.id)
  }

  const addMessage = (roomId: string, message: Message) => {
    const room = activeRoomManagerService.getRoom(roomId)

    room.addMessage(message)

    socket.to(roomId).emit('add-message', message)
  }

  socket.on('join-room', joinRoom)
  socket.on('leave-room', leaveRoom)
  socket.on('send-message', addMessage)
}
