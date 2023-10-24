import { ws } from "./ws";

interface createPeerConnectionProps {
  remotePeerId: string;
}

interface startCallProps extends createPeerConnectionProps {
  stream?: MediaStream;
}

interface createSessionDescriptionProps extends createPeerConnectionProps {
  peerConn: RTCPeerConnection;
  messageType: "offer" | "answer";
}

interface sendMessageProps {
  messageType: "offer" | "answer" | "candidate";
  payload: RTCIceCandidate | RTCSessionDescriptionInit;
  remotePeerId: string;
}

interface MessageCallbackProps extends sendMessageProps {
  peerConn: RTCPeerConnection;
}

const peerConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export const Peer = () => {
  console.log("Intaciado Peer");
  const peerConnections = <Record<string, RTCPeerConnection>>{};
  const storedIceCandidates = new Map();

  let localStream: MediaStream | undefined = undefined;

  const onIceCandidate = (
    event: RTCPeerConnectionIceEvent,
    remotePeerId: string,
  ) => {
    console.log(remotePeerId, event);
  };

  const onTrack = (event: RTCTrackEvent, remotePeerId: string) => {
    console.log(remotePeerId, event);
  };

  const createPeerConnection = async ({
    remotePeerId,
  }: createPeerConnectionProps) => {
    try {
      const peerConn = new RTCPeerConnection(peerConfig);

      peerConn.onicecandidate = (event) => {
        console.log("send iceCandidate");
        if (event.candidate) {
          sendMessage({
            messageType: "candidate",
            payload: event.candidate,
            remotePeerId,
          });
        } else {
          console.log("End of candidates.");
        }
      };

      peerConn.ontrack = (event) => {
        onTrack(event, remotePeerId);
      };

      return peerConn;
    } catch (error) {
      logError("createPeerConnection error" + error);
    }
  };

  const createSessionDescription = async ({
    messageType,
    peerConn,
    remotePeerId,
  }: createSessionDescriptionProps) => {
    try {
      let sessionDescription;

      if (messageType === "offer") {
        sessionDescription = await peerConn.createOffer();
      } else if (messageType === "answer") {
        sessionDescription = await peerConn.createAnswer();
      }

      if (!sessionDescription) {
        const errorMessage = "sessionDescription cannot be undefined";
        logError(errorMessage);

        return;
      }

      console.log(`local ${messageType} created:`, sessionDescription);

      await peerConn.setLocalDescription(sessionDescription);

      sendMessage({
        messageType,
        payload: sessionDescription,
        remotePeerId,
      });
    } catch (error) {
      logError(`create${messageType}  error:` + error);
    }
  };

  const startCall = async ({ remotePeerId }: startCallProps) => {
    console.log("start Call:", remotePeerId);
    const peerConn = await createPeerConnection({
      remotePeerId,
    });

    if (!peerConn) return;
    peerConn.createDataChannel("stream");

    peerConnections[remotePeerId] = peerConn;

    createSessionDescription({
      messageType: "offer",
      peerConn,
      remotePeerId,
    });
  };

  const processSessionDescription = async ({
    payload,
    remotePeerId,
    peerConn,
  }: MessageCallbackProps) => {
    const remoteDescription = new RTCSessionDescription(
      payload as RTCSessionDescriptionInit,
    );

    await peerConn.setRemoteDescription(remoteDescription);

    if (payload.type === "offer") {
      console.log(
        "Got offer. Sending answer to peer. remotePeerId:",
        remotePeerId,
      );

      createSessionDescription({
        messageType: "answer",
        peerConn,
        remotePeerId,
      });
    } else if (payload.type === "answer") {
      console.log("Got answer.");

      console.log(peerConnections);
    }
  };

  const addIceCandidatePending = async ({
    peerConn,
    remotePeerId,
  }: {
    peerConn: RTCPeerConnection;
    remotePeerId: string;
  }) => {
    const iceCandidates = storedIceCandidates.get(remotePeerId);

    console.log({ iceCandidates });

    if (iceCandidates?.length > 0) {
      iceCandidates.forEach((iceCandidate: RTCIceCandidate) => {
        peerConn.addIceCandidate(iceCandidate);
      });
      iceCandidates.length = 0;
    }
  };

  const signalingMessageCallback = async ({
    messageType,
    payload,
    remotePeerId,
  }: sendMessageProps) => {
    console.log(messageType, payload);
    let peerConn: RTCPeerConnection | undefined;

    const acceptedMessageType = {
      ["offer"]: async ({
        messageType,
        payload,
        remotePeerId,
        peerConn,
      }: MessageCallbackProps) => {
        await processSessionDescription({
          messageType,
          payload,
          remotePeerId,
          peerConn,
        });
      },
      ["answer"]: async ({
        messageType,
        payload,
        remotePeerId,
        peerConn,
      }: MessageCallbackProps) => {
        await processSessionDescription({
          messageType,
          payload,
          remotePeerId,
          peerConn,
        });
      },
      ["candidate"]: ({
        payload,
        remotePeerId,
        peerConn,
      }: MessageCallbackProps) => {
        console.log("add iceCandidate");
        const iceCandidate = new RTCIceCandidate(payload as RTCIceCandidate);

        if (peerConn.remoteDescription) {
          peerConn.addIceCandidate(iceCandidate);
        } else {
          if (!storedIceCandidates.has(remotePeerId)) {
            storedIceCandidates.set(remotePeerId, []);
          }

          storedIceCandidates.get(remotePeerId).push(iceCandidate);
        }
      },
    };

    if (!peerConnections[remotePeerId]) {
      peerConn = await createPeerConnection({ remotePeerId });

      if (!peerConn) return;

      peerConnections[remotePeerId] = peerConn;
    }

    peerConn = peerConnections[remotePeerId];

    if (!peerConn) {
      console.log("peerConn don't exist in peerConnections");
      return;
    }

    const functionMessageResponse = await acceptedMessageType[messageType];

    if (!functionMessageResponse) return;

    await functionMessageResponse({
      messageType,
      payload,
      remotePeerId,
      peerConn,
    });
    if (peerConn.remoteDescription) {
      addIceCandidatePending({ peerConn, remotePeerId });
    }
  };

  const setLocalStream = ({ stream }: { stream?: MediaStream }) => {
    if (!stream) return;
    localStream = stream;
  };

  function sendMessage({
    messageType,
    payload,
    remotePeerId,
  }: sendMessageProps) {
    console.log("Client sending message: ", payload);
    ws.emit(messageType, { payload, remotePeerId });
  }

  function logError(err: any) {
    if (!err) return;
    if (typeof err === "string") {
      console.warn(err);
    } else {
      console.warn(err.toString(), err);
    }
  }

  ws.on("candidate", signalingMessageCallback);
  ws.on("answer", signalingMessageCallback);
  ws.on("offer", signalingMessageCallback);

  return {
    startCall,
    setLocalStream,
  };
};
