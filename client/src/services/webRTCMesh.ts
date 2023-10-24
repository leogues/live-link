import { IPeer, Peer, RTCRenegotiate } from "./webrtc";
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

export const Peers = (stream: MediaStream) => {
  const state: IState = {
    peerConnections: {},
    localStream: stream || null,
  };

  state.peerConnections["213123123"] = Peer({ remotePeerId: "1322131" });

  const startCall = async ({
    remotePeerId,
    stream,
  }: {
    remotePeerId: string;
    stream: MediaStream;
  }) => {
    const peer = Peer({ remotePeerId, stream });
    if (!peer) return;
    state.peerConnections[remotePeerId] = peer;
  };

  const addStream = (stream: MediaStream) => {};

  function _signalMessageCallback({
    messageType,
    payload,
    remotePeerId,
  }: signalMessagesCallbackProps) {
    if (!state.peerConnections[remotePeerId]) {
      const peer = Peer({ remotePeerId, stream });
      if (!peer) return;
      state.peerConnections[remotePeerId] = peer;
    }
  }

  ws.on("candidate", _signalMessageCallback);
  ws.on("answer", _signalMessageCallback);
  ws.on("offer", _signalMessageCallback);
  return {
    startCall,
  };
};
