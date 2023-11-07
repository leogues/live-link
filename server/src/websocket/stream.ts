import { Socket } from 'socket.io'

export const streamHandler = (socket: Socket) => {
  const mediaDeviceStatusUpdate = ({
    roomId,
    type,
    enabled,
  }: {
    roomId: string
    type: string
    enabled: boolean
  }) => {
    const localPeerId = socket.request.user.id

    socket.emit('mediaDeviceStatusNotification', {
      peerId: localPeerId,
      type,
      enabled,
    })

    socket.to(roomId).emit('mediaDeviceStatusNotification', {
      peerId: localPeerId,
      type,
      enabled,
    })
  }

  socket.on('mediaDeviceStatusUpdate', mediaDeviceStatusUpdate)
}
