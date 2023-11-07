import { Socket } from 'socket.io'
import { userSocketMap } from './room'

interface peerMessageProps {
  messageType: string
  payload: RTCIceCandidate | RTCSessionDescriptionInit
  remotePeerId: string
}

export const webrtcCallHandler = (socket: Socket) => {
  const signalMessagesIntermediary = ({
    messageType,
    payload,
    remotePeerId,
  }: peerMessageProps) => {
    const remotePeerSocketId = userSocketMap[remotePeerId]
    const localPeerId = socket.request.user.id

    if (!remotePeerSocketId) {
      console.log("remotePeerId don't exist in equivalent in userSocketMap")
      return
    }

    socket.to(remotePeerSocketId).emit(messageType, {
      messageType: messageType,
      payload,
      remotePeerId: localPeerId,
    })
  }
  socket.on('renegotiate', signalMessagesIntermediary)
  socket.on('candidate', signalMessagesIntermediary)
  socket.on('offer', signalMessagesIntermediary)
  socket.on('answer', signalMessagesIntermediary)
}
