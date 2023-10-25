interface PeerProps {
  isInitiator?: boolean;
  remotePeerId: string;
  stream?: MediaStream | null;
  enabledDebug?: boolean;
}

export interface IPeer {
  addStream: ({ stream }: { stream: MediaStream }) => void;
  signalingMessageCallback: ({
    messageType,
    payload,
  }: sendMessageProps) => Promise<void>;
  destroy: (cb?: any) => void;
}

interface IState extends PeerProps {
  isInitiator: boolean;
  _isFirstNegotiatio: boolean;

  _localStream: MediaStream | null;
  _remoteStream: MediaStream | null;
  _senderMap: Map<MediaStreamTrack, Map<MediaStream, RTCRtpSender>>;

  _peerConn?: RTCPeerConnection | null;
  _pendingIceCandidates: RTCIceCandidate[];

  _queuedNegotiation: boolean;
  _isNegotiating: boolean;
  isDestroying: boolean;
  isDestroyed: boolean;
}

interface createSessionDescriptionProps {
  messageType: "offer" | "answer";
}

export interface RTCRenegotiate {
  type: "renegotiate";
}

interface sendMessageProps {
  messageType: "offer" | "answer" | "candidate" | "renegotiate";
  payload: RTCIceCandidate | RTCSessionDescriptionInit | RTCRenegotiate;
}

import errCode from "err-code";
import { ws } from "./ws";

const peerConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export const Peer = (options: PeerProps) => {
  const state: IState = {
    isInitiator: options.isInitiator || false,
    _isFirstNegotiatio: true,
    remotePeerId: options.remotePeerId,

    _peerConn: null,
    _pendingIceCandidates: [],

    _localStream: options.stream || null,
    _remoteStream: null,
    _senderMap: new Map(),

    _isNegotiating: false,
    _queuedNegotiation: false,
    isDestroyed: false,
    isDestroying: false,

    enabledDebug: options.enabledDebug || false,
  };

  const eventListeners: Record<string, Function[]> = {};

  try {
    state._peerConn = new RTCPeerConnection(peerConfig);
  } catch (err) {
    destroy(errCode(err, "ERR_PEERCONNECTION_CONSTRUCTOR"));
    return;
  }
  state._peerConn.getReceivers;

  if (state.isInitiator) {
    state._peerConn.createDataChannel("stream");
  }

  if (state._localStream) {
    addStream({ stream: state._localStream });
  }

  _logs("initial negotiation");
  _needsNegotiation();

  state._peerConn.onicecandidate = (event) => {
    _onIceCandidate(event);
  };

  state._peerConn.onsignalingstatechange = () => {
    _onSignalingStateChange();
  };

  state._peerConn.ontrack = (event) => {
    _onTrack(event);
  };

  function addStream({ stream }: { stream: MediaStream }) {
    if (state.isDestroying) return;
    if (state.isDestroyed)
      throw errCode(
        new Error("cannot addStream after peer is destroyed"),
        "ERR_DESTROYED",
      );

    stream.getTracks().forEach((track) => {
      addTrack({ track, stream });
    });
  }

  function addTrack({
    track,
    stream,
  }: {
    track: MediaStreamTrack;
    stream: MediaStream;
  }) {
    if (state.isDestroying) return;
    if (state.isDestroyed)
      throw errCode(
        new Error("cannot addTrack after peer is destroyed"),
        "ERR_DESTROYED",
      );

    const submap = state._senderMap.get(track) || new Map(); // nested Maps map [track, stream] to sender
    let sender = submap.get(stream);
    if (!sender) {
      sender = state._peerConn?.addTrack(track, stream);
      submap.set(stream, sender);
      state._senderMap.set(track, submap);
      _needsNegotiation();
    } else if (sender.removed) {
      throw errCode(
        new Error(
          "Track has been removed. You should enable/disable tracks that you want to re-add.",
        ),
        "ERR_SENDER_REMOVED",
      );
    } else {
      throw errCode(
        new Error("Track has already been added to that stream."),
        "ERR_SENDER_ALREADY_ADDED",
      );
    }
  }

  async function _addIceCandidatePending() {
    if (state._pendingIceCandidates.length > 0) {
      state._pendingIceCandidates.forEach((iceCandidate: RTCIceCandidate) => {
        state._peerConn?.addIceCandidate(iceCandidate);
      });
      state._pendingIceCandidates.length = 0;
    }
  }

  async function _processSessionDescription({ payload }: sendMessageProps) {
    const remoteDescription = new RTCSessionDescription(
      payload as RTCSessionDescriptionInit,
    );

    await state._peerConn?.setRemoteDescription(remoteDescription);

    if (payload.type === "offer") {
      _logs(
        "Got offer. Sending answer to peer. remotePeerId:",
        state.remotePeerId,
      );

      _createSessionDescription({
        messageType: "answer",
      });
    } else if (payload.type === "answer") {
      _logs("Got answer.");
    }
  }

  const signalingMessageCallback = async ({
    messageType,
    payload,
  }: sendMessageProps) => {
    if (!state._peerConn) return;
    const acceptedMessageType = {
      ["offer"]: async ({ messageType, payload }: sendMessageProps) => {
        _logs("_init _processSessionDescription", messageType);
        await _processSessionDescription({
          messageType,
          payload,
        });
      },
      ["answer"]: async ({ messageType, payload }: sendMessageProps) => {
        _logs("_init _processSessionDescription", messageType);
        await _processSessionDescription({
          messageType,
          payload,
        });
      },
      ["candidate"]: ({ payload }: sendMessageProps) => {
        _logs("add iceCandidate");
        const iceCandidate = new RTCIceCandidate(payload as RTCIceCandidate);

        if (state._peerConn?.remoteDescription) {
          state._peerConn.addIceCandidate(iceCandidate);
        } else {
          state._pendingIceCandidates.push(iceCandidate);
        }
      },
      ["renegotiate"]: ({}: sendMessageProps) => {
        _logs("need renegotiate");
        if (state.isInitiator) {
          _needsNegotiation();
        }
      },
    };

    const functionMessageResponse = await acceptedMessageType[messageType];

    if (!functionMessageResponse) return;

    await functionMessageResponse({
      messageType,
      payload,
    });

    if (state._peerConn.remoteDescription) {
      _addIceCandidatePending();
    }
  };

  function destroy(cb?: any) {
    if (state.isDestroyed || state.isDestroying) return;
    state.isDestroying = true;

    queueMicrotask(() => {
      state.isDestroyed = true;
      state.isDestroying = false;

      if (state._peerConn) {
        try {
          state._peerConn.close();
        } catch (err) {}

        state._peerConn.oniceconnectionstatechange = null;
        state._peerConn.onicegatheringstatechange = null;
        state._peerConn.onsignalingstatechange = null;
        state._peerConn.onicecandidate = null;
        state._peerConn.ontrack = null;
        state._peerConn.ondatachannel = null;
      }
      state._peerConn = null;

      cb();
    });
  }

  async function _createSessionDescription({
    messageType,
  }: createSessionDescriptionProps) {
    if (state.isDestroying || state.isDestroyed) return;
    if (!state._peerConn) return;

    let sessionDescription;

    try {
      if (messageType === "offer") {
        sessionDescription = await state._peerConn.createOffer();
      } else if (messageType === "answer") {
        sessionDescription = await state._peerConn.createAnswer();
      }
    } catch (err) {
      destroy(errCode(err, "ERR_CREATE_" + messageType));
    }

    _logs(`local ${messageType} created:`, sessionDescription);

    try {
      await state._peerConn.setLocalDescription(sessionDescription);
    } catch (err) {
      destroy(errCode(err, "ERR_SET_LOCAL_DESCRIPTION"));
    }

    if (!sessionDescription) return;

    _sendMessage({
      messageType,
      payload: sessionDescription,
    });
  }

  function _needsNegotiation() {
    if (state.isDestroying) return;
    if (state.isDestroyed)
      throw errCode(
        new Error("cannot negotiate after peer is destroyed"),
        "ERR_DESTROYED",
      );

    if (state.isInitiator) {
      if (state._isNegotiating) {
        state._queuedNegotiation = true;
        _logs("already negotiating, queueing");
      } else {
        _logs("start negotiation");
        _createSessionDescription({ messageType: "offer" });
      }
    } else {
      if (state._isNegotiating) {
        state._queuedNegotiation = true;
        _logs("already negotiating, queueing");
      } else {
        _logs("requesting negotiation from initiator");
        _sendMessage({
          messageType: "renegotiate",
          payload: { type: "renegotiate" },
        });
      }
    }
    state._isNegotiating = true;
  }

  function _sendMessage({ messageType, payload }: sendMessageProps) {
    _logs("Client sending message: ", payload);
    ws.emit(messageType, { payload, remotePeerId: state.remotePeerId });
  }

  function _logs(...rest: any[]) {
    if (!state.enabledDebug) return;
    console.log(...rest);
  }

  function _onIceCandidate(event: RTCPeerConnectionIceEvent) {
    _logs("send iceCandidate");
    if (event.candidate) {
      _sendMessage({
        messageType: "candidate",
        payload: event.candidate,
      });
    } else {
      _logs("End of candidates.");
    }
  }

  function _onSignalingStateChange() {
    if (state.isDestroyed) return;

    if (state._peerConn?.signalingState === "stable") {
      state._isNegotiating = false;

      if (state._queuedNegotiation) {
        _logs("flushing negotiation queue");
        state._queuedNegotiation = false;
        _needsNegotiation();
      } else {
        _logs("negotiated");
      }
    }
  }

  function _onTrack(event: RTCTrackEvent) {
    if (state.isDestroyed) return;

    event.streams.forEach((eventStream) => {});
    console.log(event);
    _emitEvent("stream", {});
  }

  function on(event: string, listener: Function) {
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

  return {
    on,
    addStream,
    signalingMessageCallback,
    destroy,
  };
};
