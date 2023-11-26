import { Socket } from 'socket.io'
import { rooms } from './room'

const mediaDeviceMap = {
  microphone: 'isMicOn',
  'web-cam': 'isWebCamOn',
  'sharing-screen': 'isSharingScreenOn',
}

type IMediaDeviceKey = keyof typeof mediaDeviceMap

type IPeerDevicePropriety = 'isMicOn' | 'isWebCamOn' | 'isSharingScreenOn'

export const streamHandler = (socket: Socket) => {
  const updatePeerDeviceState = ({
    roomId,
    enabled,
    localPeerId,
    type,
  }: {
    roomId: string
    enabled: boolean
    localPeerId: string
    type: IMediaDeviceKey
  }) => {
    if (rooms[roomId] && rooms[roomId][localPeerId]) {
      const peer = rooms[roomId][localPeerId]
      const peerDeviceStatePropertyKey = mediaDeviceMap[
        type
      ] as IPeerDevicePropriety

      if (!peerDeviceStatePropertyKey) return

      if (!peer[peerDeviceStatePropertyKey] === undefined) return

      peer[peerDeviceStatePropertyKey] = enabled
    }
  }

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

    updatePeerDeviceState({ roomId, enabled, localPeerId, type })

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
