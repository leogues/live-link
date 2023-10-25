import { IPeer, Peer, RTCRenegotiate } from "./peer";
import { ws } from "./ws";

interface IState {
  peerConnections: Record<string, IPeer>;
  localStream: MediaStream | null;
}

interface signalMessagesCallbackProps {
  messageType: "offer" | "answer" | "candidate" | "renegotiate";
  payload: RTCIceCandidate | RTCSessionDescriptionInit | RTCRenegotiate;
  remotePeerId: string;
}

export interface IPeers {
  startCall: ({
    remotePeerId,
    stream,
  }: {
    remotePeerId: string;
    stream?: MediaStream;
  }) => void;
  close: (remotePeerId: string) => void;
  destroy: () => void;
  addStream: (stream?: MediaStream) => void;
}

export const Peers = () => {
  const state: IState = {
    peerConnections: {},
    localStream: null,
  };

  console.log("init multiPeer");

  const startCall = ({
    remotePeerId,
    stream,
  }: {
    remotePeerId: string;
    stream?: MediaStream;
  }) => {
    console.log("start call");
    if (stream) {
      state.localStream = stream;
    }

    const peer = Peer({
      remotePeerId,
      stream: state.localStream,
      isInitiator: true,
    });

    if (peer) {
      state.peerConnections[remotePeerId] = peer;
    }
  };

  const addStream = (stream?: MediaStream) => {
    console.log("add Stream");
    if (!stream) return;

    state.localStream = stream;
    Object.values(state.peerConnections).forEach(
      (peerConn) => peerConn?.addStream({ stream }),
    );
  };

  function _signalMessageCallback({
    messageType,
    payload,
    remotePeerId,
  }: signalMessagesCallbackProps) {
    console.log("signal");
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
    console.log("close");
    const peerConn = state.peerConnections[remotePeerId];

    if (peerConn) {
      peerConn.destroy();
      delete state.peerConnections[remotePeerId];
    }
  };

  const destroy = () => {
    ws.off("renegotiate");
    ws.off("candidate");
    ws.off("answer");
    ws.off("offer");
    console.log("close", state.peerConnections);

    Object.values(state.peerConnections)
      .filter((peerConn) => peerConn !== undefined)
      .forEach((peerConn) => {
        console.log(peerConn);
        peerConn?.destroy();
      });
    state.peerConnections = {};
  };

  ws.on("renegotiate", _signalMessageCallback);
  ws.on("candidate", _signalMessageCallback);
  ws.on("answer", _signalMessageCallback);
  ws.on("offer", _signalMessageCallback);
  return {
    startCall,
    close,
    destroy,
    addStream,
  };
};
