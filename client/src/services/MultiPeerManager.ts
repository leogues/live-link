import { IPeer, Peer, RTCRenegotiate } from "./peer";
import { ws } from "./ws";

interface IState {
  peerConnections: Record<string, IPeer | undefined>;
  localStream: MediaStream | null;
}

interface signalMessagesCallbackProps {
  messageType: "offer" | "answer" | "candidate" | "renegotiate";
  payload: RTCIceCandidate | RTCSessionDescriptionInit | RTCRenegotiate;
  remotePeerId: string;
}

export const Peers = () => {
  const state: IState = {
    peerConnections: {},
    localStream: null,
  };

  const startCall = async ({
    remotePeerId,
    stream,
  }: {
    remotePeerId: string;
    stream: MediaStream;
  }) => {
    if (stream) {
      state.localStream = stream;
    }

    const peer = Peer({
      remotePeerId,
      stream: state.localStream,
      isInitiator: true,
    });

    if (!peer) return;

    state.peerConnections[remotePeerId] = peer;
  };

  const addStream = (stream?: MediaStream) => {
    if (!stream) return;
    state.localStream = stream;
    Object.values(state.peerConnections)
      .filter((peerConn) => peerConn !== undefined)
      .forEach((peerConn) => peerConn?.addStream({ stream }));
  };

  function _signalMessageCallback({
    messageType,
    payload,
    remotePeerId,
  }: signalMessagesCallbackProps) {
    let peer;
    if (!state.peerConnections[remotePeerId]) {
      peer = Peer({ remotePeerId, stream: state.localStream });

      if (!peer) return;

      state.peerConnections[remotePeerId] = peer;
    }

    peer = state.peerConnections[remotePeerId];

    peer?.signalingMessageCallback({ messageType, payload });
  }

  const close = (remotePeerId: string) => {
    const peerConn = state.peerConnections[remotePeerId];

    if (!peerConn) return;

    peerConn.destroy();
    delete state.peerConnections[remotePeerId];
  };

  const closeAll = () => {
    Object.values(state.peerConnections)
      .filter((peerConn) => peerConn !== undefined)
      .forEach((peerConn) => peerConn?.destroy());
  };

  ws.on("renegotiate", _signalMessageCallback);
  ws.on("candidate", _signalMessageCallback);
  ws.on("answer", _signalMessageCallback);
  ws.on("offer", _signalMessageCallback);
  return {
    startCall,
    close,
    closeAll,
    addStream,
  };
};
