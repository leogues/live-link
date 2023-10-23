import Peer from "peerjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { UserV2Context } from "./UserV2Context";
import { ws } from "../services/ws";
import { addPeerStreamAction } from "../reducers/peersActions";
import { RoomV2Context } from "./RoomV2Context";
import { IPeer } from "../types/peer";

interface getMediaProps {
  type: "user-media" | "display-media";
  constraints: MediaStreamConstraints;
}

interface sendMessageProps {
  messageType: "offer" | "answer" | "candidate";
  payload: RTCIceCandidate | RTCSessionDescriptionInit;
  remotePeerId: string;
}

interface MessageCallbackProps extends sendMessageProps {
  peerConn: RTCPeerConnection;
}

interface createPeerConnectionProps {
  remotePeerId: string;
}

interface StreamContextProps {
  children: React.ReactNode;
}

interface StreamValue {
  localStream?: MediaStream;
}

export const StreamContext = createContext<StreamValue>({
  localStream: new MediaStream(),
});

// const peerConfig = {
//   'iceServers': [{
//     'urls': 'stun:stun.l.google.com:19302'
//   }]
// };

const peerConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export const StreamProvider: React.FunctionComponent<StreamContextProps> = ({
  children,
}) => {
  const { peers, dispatchPeers } = useContext(RoomV2Context);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const [storedIceCandidates, setStoredIceCandidates] = useState(new Map());
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isWebcamOn, setIsWebCamOn] = useState<boolean>(true);
  const [isStreamScreen, setIsStreamScreen] = useState<boolean>(false);

  const grabMediaStream = async ({ type, constraints }: getMediaProps) => {
    const acceptedMedia = {
      "user-media": (constraints: MediaStreamConstraints) => {
        try {
          return navigator.mediaDevices.getUserMedia(constraints);
        } catch (error) {
          console.error(error);
        }
      },
      "display-media": (constraints: MediaStreamConstraints) => {
        return navigator.mediaDevices.getDisplayMedia(constraints);
      },
    };

    const functionMedia = acceptedMedia[type];

    if (!functionMedia) return;

    const media = await functionMedia(constraints);

    if (!media) return;
    setLocalStream(media);
  };

  function sendMessage({
    messageType,
    payload,
    remotePeerId,
  }: sendMessageProps) {
    //console.log("Client sending message: ", payload);
    ws.emit(messageType, { payload, remotePeerId });
  }

  const createAnswer = async (
    peerConn: RTCPeerConnection,
    remotePeerId: string,
  ) => {
    const sessionDescription = await peerConn.createAnswer();

    console.log("local session created:", sessionDescription);

    await peerConn.setLocalDescription(sessionDescription);

    sendMessage({
      messageType: "answer",
      payload: sessionDescription,
      remotePeerId,
    });
  };

  const createPeerOffer = async (
    peerConn: RTCPeerConnection,
    remotePeerId: string,
  ) => {
    try {
      localStream?.getTracks().forEach((track) => {
        peerConn.addTrack(track, localStream);
      });

      const sessionDescription = await peerConn.createOffer();
      await peerConn.setLocalDescription(sessionDescription);
      console.log("sending local desc:", peerConn.localDescription);
      sendMessage({
        messageType: "offer",
        payload: sessionDescription,
        remotePeerId,
      });
    } catch (error) {
      console.log("createPeerOffer error:", error);
    }
  };

  const signalingMessageCallback = async ({
    messageType,
    payload,
    remotePeerId,
  }: sendMessageProps) => {
    let peerConn: RTCPeerConnection | undefined;

    const acceptedMessageType = {
      ["offer"]: async ({
        payload,
        remotePeerId,
        peerConn,
      }: MessageCallbackProps) => {
        console.log(
          "Got offer. Sending answer to peer. remotePeerId:",
          remotePeerId,
        );

        const remoteDescription = new RTCSessionDescription(
          payload as RTCSessionDescriptionInit,
        );

        await peerConn.setRemoteDescription(remoteDescription);

        createAnswer(peerConn, remotePeerId);
      },
      ["answer"]: ({ payload, peerConn }: MessageCallbackProps) => {
        console.log("Got answer.");

        const remoteDescription = new RTCSessionDescription(
          payload as RTCSessionDescriptionInit,
        );

        peerConn.setRemoteDescription(remoteDescription);
      },
      ["candidate"]: ({
        payload,
        remotePeerId,
        peerConn,
      }: MessageCallbackProps) => {
        const iceCandidate = new RTCIceCandidate(payload as RTCIceCandidate);

        if (!storedIceCandidates.has(remotePeerId)) {
          storedIceCandidates.set(remotePeerId, []);
        }

        storedIceCandidates.get(remotePeerId).push(iceCandidate);

        if (peerConn && peerConn.remoteDescription) {
          peerConn.addIceCandidate(iceCandidate);
        }
      },
    };

    !peerConnections.current[remotePeerId]
      ? (peerConn = await createPeerConnection({ remotePeerId }))
      : (peerConn = peerConnections.current[remotePeerId]);

    if (!peerConn) {
      console.log("peerConn don't exist in peerConnections");
      return;
    }

    const functionMessageResponse = await acceptedMessageType[messageType];

    if (!functionMessageResponse) return;

    functionMessageResponse({ messageType, payload, remotePeerId, peerConn });
  };

  const createPeerConnection = async ({
    remotePeerId,
  }: createPeerConnectionProps) => {
    try {
      const peerConn = new RTCPeerConnection(peerConfig);

      peerConn.onicecandidate = (event) => {
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

      peerConn.onicegatheringstatechange = (event) => {
        console.log("onicegatheringstatechange:", event);
      };

      peerConn.ontrack = (event) => {
        console.log("ontrack:", event);
        const stream = event.streams[0];

        console.log("addStream", stream, "to", remotePeerId);
        dispatchPeers(addPeerStreamAction(remotePeerId, stream));
      };

      return peerConn;
    } catch (error) {
      console.log("createPeerConnection error", error);
    }
  };

  const peerJoined = async (peer: IPeer) => {
    if (!localStream) return;

    const remotePeerId = peer.user.id;

    if (!remotePeerId) return;

    const peerConn = await createPeerConnection({
      remotePeerId,
    });

    if (!peerConn) return;

    peerConnections.current = {
      ...peerConnections.current,
      [remotePeerId]: peerConn,
    };

    console.log({ peerConnections: peerConnections.current });

    createPeerOffer(peerConn, peer.user.id);
  };

  useEffect(() => {
    grabMediaStream({
      type: "user-media",
      constraints: { audio: isMuted, video: isWebcamOn },
    });
  }, []);

  useEffect(() => {
    ws.on("candidate", signalingMessageCallback);
    ws.on("answer", signalingMessageCallback);
    ws.on("offer", signalingMessageCallback);
    ws.on("user-joined", peerJoined);
    return () => {
      ws.off("candidate");
      ws.off("answer");
      ws.off("offer");
      ws.off("user-joined");
    };
  }, [localStream]);

  return (
    <StreamContext.Provider value={{ localStream }}>
      {children}
    </StreamContext.Provider>
  );
};
