import { Socket } from 'socket.io'

import { IActiveRoomManagerService } from '../interfaces/services/IActiveRoomManagerService'

interface peerMessageProps {
  messageType: string
  payload: RTCIceCandidate | RTCSessionDescriptionInit
  remotePeerId: string
}

export const webrtcCallHandler = (
  socket: Socket,
  activeRoomManagerService: IActiveRoomManagerService
) => {
  const signalMessagesIntermediary = ({
    messageType,
    payload,
    remotePeerId,
  }: peerMessageProps) => {
    const remotePeerSocketId =
      activeRoomManagerService.getUserSocket(remotePeerId)
    const localPeerId = socket.request.user.id

    if (!remotePeerSocketId) {
      return
    }

    socket.to(remotePeerSocketId).emit(messageType, {
      messageType,
      payload,
      remotePeerId: localPeerId,
    })
  }
  socket.on('renegotiate', signalMessagesIntermediary)
  socket.on('candidate', signalMessagesIntermediary)
  socket.on('offer', signalMessagesIntermediary)
  socket.on('answer', signalMessagesIntermediary)
}
