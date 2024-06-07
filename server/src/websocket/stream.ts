import { Socket } from 'socket.io'

import { IActiveRoomManagerService } from '../interfaces/services/IActiveRoomManagerService'

const mediaDeviceMap = {
  microphone: 'isMicOn',
  'web-cam': 'isWebCamOn',
  'sharing-screen': 'isSharingScreenOn',
}

type IMediaDeviceKey = keyof typeof mediaDeviceMap

export const streamHandler = (
  socket: Socket,
  activeRoomManagerService: IActiveRoomManagerService
) => {
  const mediaDeviceStatusUpdate = ({
    roomId,
    type,
    enabled,
  }: {
    roomId: string
    type: IMediaDeviceKey
    enabled: boolean
  }) => {
    const localPeerId = socket.request.user.id

    const room = activeRoomManagerService.getRoom(roomId)
    const peerDeviceStatePropertyKey = mediaDeviceMap[type]

    room.updatePeer(localPeerId, { [peerDeviceStatePropertyKey]: enabled })

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
