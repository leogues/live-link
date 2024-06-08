import { ws } from "../services/ws";
import { IPeer, Peer, RTCRenegotiate } from "./peer";

interface IState {
  localStream: MediaStream;
  peerConnections: Record<string, IPeer>;
  _mediaTracks: {
    audioTrack: MediaStreamTrack | null;
    videoTrack: MediaStreamTrack | null;
    screenAudioTrack: MediaStreamTrack | null;
  };
}

interface signalMessagesCallbackProps {
  messageType: "offer" | "answer" | "candidate" | "renegotiate";
  payload: RTCIceCandidate | RTCSessionDescriptionInit | RTCRenegotiate;
  remotePeerId: string;
}

type eventFunction = Function | undefined;

export interface IPeers {
  startCall: ({
    remotePeerId,
    mediaTracks,
  }: {
    remotePeerId: string;
    mediaTracks: IState["_mediaTracks"];
  }) => void;
  close: (remotePeerId: string) => void;
  destroy: () => void;
  addStream: (stream?: MediaStream) => void;
  updateMediaTracks: ({
    mediaTracks,
  }: {
    mediaTracks: IState["_mediaTracks"];
  }) => MediaStream;
  off: (event: string) => void;
  on: (event: string, listener?: Function) => void;
}

export const Peers = () => {
  const state: IState = {
    localStream: new MediaStream(),
    peerConnections: {},
    _mediaTracks: {
      audioTrack: null,
      videoTrack: null,
      screenAudioTrack: null,
    },
  };

  const eventListeners: Record<string, Function[]> = {};

  let _onStream: eventFunction = ({
    stream,
    remotePeerId,
  }: {
    stream: MediaStream;
    remotePeerId: string;
  }) => {
    _emitEvent("stream", { stream, remotePeerId });
  };

  const startCall = ({ remotePeerId }: { remotePeerId: string }) => {
    const peer = Peer({
      remotePeerId,
      initialTracks: state._mediaTracks,
      isInitiator: true,
    });

    if (peer) {
      peer.on("stream", _onStream);

      state.peerConnections[remotePeerId] = peer;
    }
  };

  const updateMediaTracks = ({
    mediaTracks,
  }: {
    mediaTracks: IState["_mediaTracks"];
  }) => {
    Object.keys(mediaTracks).forEach((mediaTrackKey) => {
      const _track =
        state._mediaTracks[mediaTrackKey as keyof typeof state._mediaTracks];
      const track =
        mediaTracks[mediaTrackKey as keyof typeof state._mediaTracks];

      if (track && !_track) {
        state.localStream.addTrack(track);

        Object.values(state.peerConnections).forEach((peerConn) => {
          peerConn.addTrack({ track });
        });
      } else if (track && _track && track !== _track) {
        state.localStream.removeTrack(_track);
        state.localStream.addTrack(track);

        Object.values(state.peerConnections).forEach((peerConn) => {
          peerConn.replaceTrack({ oldTrack: _track, newTrack: track });
        });
      }
    });

    state._mediaTracks = mediaTracks;

    return state.localStream;
  };

  const addStream = (stream?: MediaStream) => {

    if (!stream) return;

    Object.values(state.peerConnections).forEach(
      (peerConn) => peerConn?.addStream({ stream }),
    );
  };

  function _signalMessageCallback({
    messageType,
    payload,
    remotePeerId,
  }: signalMessagesCallbackProps) {
    let peer;
    if (!state.peerConnections[remotePeerId]) {
      peer = Peer({ remotePeerId, initialTracks: state._mediaTracks });

      if (!peer) return;

      peer.on("stream", _onStream);

      state.peerConnections[remotePeerId] = peer;
    }

    peer = state.peerConnections[remotePeerId];

    peer?.signalingMessageCallback({ messageType, payload });
  }

  const close = (remotePeerId: string) => {

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

    _onStream = undefined;

    state._mediaTracks.audioTrack = null;
    state._mediaTracks.screenAudioTrack = null;
    state._mediaTracks.videoTrack = null;

    Object.values(state.peerConnections)
      .filter((peerConn) => peerConn !== undefined)
      .forEach((peerConn) => {
        peerConn.off("stream");
        peerConn?.destroy();
      });
    state.peerConnections = {};
  };

  function on(event: string, listener?: Function) {
    if (!listener) return;
    if (!eventListeners[event]) {
      eventListeners[event] = [];
    }
    eventListeners[event].push(listener);
  }

  function _emitEvent(event: string, data: any) {
    const listeners = eventListeners[event] || [];
    listeners.forEach((listener) => {
      listener(data);
    });
  }

  function off(event: string) {
    eventListeners[event] = [];
  }

  ws.on("renegotiate", _signalMessageCallback);
  ws.on("candidate", _signalMessageCallback);
  ws.on("answer", _signalMessageCallback);
  ws.on("offer", _signalMessageCallback);
  return {
    on,
    off,
    startCall,
    addStream,
    updateMediaTracks,
    close,
    destroy,
  };
};
