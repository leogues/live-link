import { createContext, useContext, useEffect, useRef, useState } from "react";
import { UserV2Context } from "./UserV2Context";
import { ws } from "../services/ws";
import { addPeerStreamAction } from "../reducers/peersActions";
import { RoomV2Context } from "./RoomV2Context";
import { IPeer } from "../types/peer";
import { Peers } from "../services/MultiPeerManager";

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

export const StreamProvider: React.FunctionComponent<StreamContextProps> = ({
  children,
}) => {
  //const { peers, dispatchPeers } = useContext(RoomV2Context);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const peers = useRef<any>();
  const [isMicOn, setIsMuted] = useState<boolean>(true);
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

  const peerJoined = async (peer: IPeer) => {
    console.log("joined:", peer.user.id);

    peers.current.startCall({
      remotePeerId: peer.user.id,
      stream: localStream,
    });
  };

  const endCall = (peerId: string) => {
    console.log("end call:", peerId);

    peers.current.close(peerId);
  };

  useEffect(() => {
    grabMediaStream({
      type: "user-media",
      constraints: { audio: isMicOn, video: isWebcamOn },
    });

    peers.current = Peers();

    ws.on("call-new-user", peerJoined);
    ws.on("end-call", endCall);
    return () => {
      peers.current.closeAll();
      peers.current = null;
      ws.off("call-new-user");
      ws.off("end-call");
    };
  }, []);

  useEffect(() => {
    peers.current.addStream(localStream);
  }, [localStream]);

  return (
    <StreamContext.Provider value={{ localStream }}>
      {children}
    </StreamContext.Provider>
  );
};
