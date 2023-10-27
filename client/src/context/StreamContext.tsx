import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ws } from "../services/ws";
import { addPeerStreamAction } from "../reducers/peersActions";
import { RoomV2Context } from "./RoomV2Context";
import { IPeer } from "../types/peer";
import { IPeers, Peers } from "../services/multiPeerManager";

interface getMediaProps {
  type: "user-media" | "display-media";
  constraints: MediaStreamConstraints;
}
interface StreamContextProps {
  children: React.ReactNode;
}

type IMediaTracks = {
  audioTrack: MediaStreamTrack | null;
  videoTrack: MediaStreamTrack | null;
  screenTrack: MediaStreamTrack | null;
};
interface StreamValue {
  localStream?: MediaStream;
  isMicOn: boolean;
  isWebCamOn: boolean;
  isStreamScreenOn: boolean;
  handleMicOn: () => void;
  handleWebCamOn: () => void;
  handleScreenOn: () => void;
}

export const StreamContext = createContext<StreamValue>({
  localStream: new MediaStream(),
  isMicOn: true,
  isWebCamOn: true,
  isStreamScreenOn: false,
  handleMicOn: () => {},
  handleWebCamOn: () => {},
  handleScreenOn: () => {},
});

export const StreamProvider: React.FunctionComponent<StreamContextProps> = ({
  children,
}) => {
  const { dispatchPeers } = useContext(RoomV2Context);

  const [localStream, setLocalStream] = useState<MediaStream>();

  const mediaTracks = useRef<IMediaTracks>({
    audioTrack: null,
    videoTrack: null,
    screenTrack: null,
  });

  const multiPeersManager = useRef<IPeers | null>(null);

  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isWebCamOn, setIsWebCamOn] = useState<boolean>(true);
  const [isStreamScreenOn, setIsStreamScreenOn] = useState<boolean>(false);

  const createMediaStream = () => {
    const newMediaStream = new MediaStream();

    if (mediaTracks.current.audioTrack && isMicOn) {
      newMediaStream.addTrack(mediaTracks.current.audioTrack);
    }

    if (mediaTracks.current.videoTrack && isWebCamOn && !isStreamScreenOn) {
      newMediaStream.addTrack(mediaTracks.current.videoTrack);
    }

    if (mediaTracks.current.screenTrack && isStreamScreenOn) {
      newMediaStream.addTrack(mediaTracks.current.screenTrack);
    }

    setLocalStream(newMediaStream);
  };

  const grabMediaStreamTracks = async ({
    type,
    constraints,
  }: getMediaProps) => {
    const acceptedMedia = {
      "user-media": async (constraints: MediaStreamConstraints) => {
        try {
          const media = await navigator.mediaDevices.getUserMedia(constraints);

          const mediaTrack = {
            audio: media.getAudioTracks()[0],
            video: media.getVideoTracks()[0],
          };

          return (mediaTracks.current = {
            ...mediaTracks.current,
            audioTrack: mediaTrack.audio,
            videoTrack: mediaTrack.video,
          });
        } catch (error) {
          console.error(error);
        }
      },
      "display-media": async (constraints: MediaStreamConstraints) => {
        const media = await navigator.mediaDevices.getDisplayMedia(constraints);

        const screenTrack = media.getVideoTracks()[0];

        return (mediaTracks.current = { ...mediaTracks.current, screenTrack });
      },
    };

    const functionMedia = acceptedMedia[type];

    if (!functionMedia) return;

    await functionMedia(constraints);
  };

  async function requestUserMediaAccess() {
    const userMediaConstraint = { audio: false, video: false };

    if (isMicOn && !mediaTracks.current.audioTrack) {
      userMediaConstraint.audio = true;
    }

    if (isWebCamOn && !mediaTracks.current.videoTrack) {
      userMediaConstraint.video = true;
    }

    if (userMediaConstraint.audio || userMediaConstraint.video) {
      await grabMediaStreamTracks({
        type: "user-media",
        constraints: userMediaConstraint,
      });
    }

    console.log();

    createMediaStream();
  }

  async function requestDisplayMediaAccess() {
    if (isStreamScreenOn) {
      await grabMediaStreamTracks({
        type: "display-media",
        constraints: { video: true },
      });
    }

    createMediaStream();
  }

  const addStream = ({
    stream,
    remotePeerId,
  }: {
    stream: MediaStream;
    remotePeerId: string;
  }) => {
    dispatchPeers(addPeerStreamAction(remotePeerId, stream));
  };

  const peerJoined = async (peer: IPeer) => {
    console.log("joined:", peer.user.id);

    multiPeersManager.current?.startCall({
      remotePeerId: peer.user.id,
      stream: localStream,
    });
  };

  const endCall = (peerId: string) => {
    console.log("end call:", peerId);

    multiPeersManager.current?.close(peerId);
  };

  const handleMicOn = () => {
    setIsMicOn(!isMicOn);
  };

  const handleWebCamOn = () => {
    setIsWebCamOn(!isWebCamOn);
  };

  const handleScreenOn = () => {
    setIsStreamScreenOn(!isStreamScreenOn);
  };

  useEffect(() => {
    console.log("render Stream");
    multiPeersManager.current = Peers();

    requestUserMediaAccess();

    multiPeersManager.current?.on("stream", addStream);
    ws.on("call-new-user", peerJoined);
    ws.on("end-call", endCall);
    return () => {
      ws.off("call-new-user");
      ws.off("end-call");
      multiPeersManager.current?.off("stream");
      multiPeersManager.current?.destroy();
      multiPeersManager.current = null;
    };
  }, []);

  useEffect(() => {
    if (!localStream) return;
    console.log(localStream);
    multiPeersManager.current?.addStream(localStream);
  }, [localStream]);

  useEffect(() => {
    requestDisplayMediaAccess();
  }, [isStreamScreenOn]);

  useEffect(() => {
    requestUserMediaAccess();
  }, [isMicOn, isWebCamOn]);

  return (
    <StreamContext.Provider
      value={{
        localStream,
        isMicOn,
        isStreamScreenOn,
        isWebCamOn,
        handleMicOn,
        handleWebCamOn,
        handleScreenOn,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};
