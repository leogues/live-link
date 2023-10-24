import { createContext, useContext, useEffect, useRef, useState } from "react";
import { UserV2Context } from "./UserV2Context";
import { ws } from "../services/ws";
import { addPeerStreamAction } from "../reducers/peersActions";
import { RoomV2Context } from "./RoomV2Context";
import { IPeer } from "../types/peer";
import { Peer } from "../services/webrtc";

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
  //const { peers, dispatchPeers } = useContext(RoomV2Context);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const myPeer = useRef<any>(); // const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  // const [storedIceCandidates, setStoredIceCandidates] = useState(new Map());
  const [isMicOn, setIsMuted] = useState<boolean>(true);
  const [isWebcamOn, setIsWebCamOn] = useState<boolean>(true);
  const [isStreamScreen, setIsStreamScreen] = useState<boolean>(false);

  const grabMediaStream = async ({ type, constraints }: getMediaProps) => {
    console.log("test", { type, constraints });

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
    console.log({ media });

    if (!media) return;
    setLocalStream(media);
  };

  const peerJoined = async (peer: IPeer) => {
    console.log("joined:", peer.user.id);

    console.log(myPeer.current.peerConn);
  };

  useEffect(() => {
    grabMediaStream({
      type: "user-media",
      constraints: { audio: isMicOn, video: isWebcamOn },
    });

    myPeer.current = Peer({
      remotePeerId: "e2a789b0-e41c-4b73-bee9-9af4de74e38b",
      isInitiator: true,
    });

    return () => {
      myPeer.current = null;
    };
  }, []);

  useEffect(() => {
    console.log(localStream);
    ws.on("call-new-user", peerJoined);
    return () => {
      ws.off("call-new-user");
    };
  }, [localStream]);

  return (
    <StreamContext.Provider value={{ localStream }}>
      {children}
    </StreamContext.Provider>
  );
};
