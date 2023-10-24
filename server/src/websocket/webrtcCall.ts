import { Socket } from 'socket.io'
import { userSocketMap } from './room'

interface peerMessageProps {
  payload: RTCIceCandidate | RTCSessionDescriptionInit
  remotePeerId: string
}

export const webrtcCallHandler = (socket: Socket) => {
  const peerCandidate = ({ payload, remotePeerId }: peerMessageProps) => {
    console.log(payload)
    const remotePeerSocketId = userSocketMap[remotePeerId]
    const localPeerId = socket.request.user.id

    if (!remotePeerSocketId) {
      console.log("remotePeerId don't exist in equivalent in userSocketMap")
      return
    }

    socket.to(remotePeerSocketId).emit('candidate', {
      messageType: 'candidate',
      payload,
      remotePeerId: localPeerId,
    })
  }

  const peerAnswer = ({ payload, remotePeerId }: peerMessageProps) => {
    console.log(payload)

    const remotePeerSocketId = userSocketMap[remotePeerId]
    const localPeerId = socket.request.user.id

    if (!remotePeerSocketId) {
      console.log("remotePeerId don't exist in equivalent in userSocketMap")
      return
    }

    socket.to(remotePeerSocketId).emit('answer', {
      messageType: 'answer',
      payload,
      remotePeerId: localPeerId,
    })
  }

  const peerOffer = ({ payload, remotePeerId }: peerMessageProps) => {
    console.log(payload)

    const remotePeerSocketId = userSocketMap[remotePeerId]
    const localPeerId = socket.request.user.id
    if (!remotePeerSocketId) {
      console.log("remotePeerId don't exist in equivalent in userSocketMap")
      return
    }

    socket.to(remotePeerSocketId).emit('offer', {
      messageType: 'offer',
      payload,
      remotePeerId: localPeerId,
    })
  }
  socket.on('candidate', peerCandidate)
  socket.on('offer', peerOffer)
  socket.on('answer', peerAnswer)
}
