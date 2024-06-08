import {
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { addPeerStreamAction } from "../reducers/peersActions";
import { ws } from "../services/ws";
import { IPeer } from "../types/peer";
import { IPeers, Peers } from "../utils/multiPeerManager";
import { RoomV2Context } from "./RoomV2Context";

interface getMediaProps {
  type: "user-media" | "display-media";
  constraints: MediaStreamConstraints;
}
interface StreamContextProps {
  children: React.ReactNode;
}

type removeTrackProps =
  | "audioTrack"
  | "videoTrack"
  | "screenTrack"
  | "screenAudioTrack";

type enableUserTrackProps = {
  mediaTrackType: "audioTrack" | "videoTrack";
  constraints: {
    video?: boolean;
    audio?: boolean;
  };
};

type IMediaTracks = {
  audioTrack: MediaStreamTrack | null;
  screenTrack: MediaStreamTrack | null;
  screenAudioTrack: MediaStreamTrack | null;
  videoTrack: MediaStreamTrack | null;
};
export interface StreamValue {
  localStream: MutableRefObject<MediaStream | undefined>;
  mediaTracks: IMediaTracks;
  handleMicOn: () => void;
  handleWebCamOn: () => void;
  handleScreenOn: () => void;
}

export const StreamContext = createContext<StreamValue>({
  localStream: { current: undefined },
  mediaTracks: {
    audioTrack: null,
    screenTrack: null,
    screenAudioTrack: null,
    videoTrack: null,
  },
  handleMicOn: () => {},
  handleWebCamOn: () => {},
  handleScreenOn: () => {},
});

export const StreamProvider: React.FunctionComponent<StreamContextProps> = ({
  children,
}) => {
  const { room, dispatchPeers, isEnteredRoom } = useContext(RoomV2Context);

  const localStream = useRef<MediaStream>(new MediaStream());

  const [mediaTracks, setMediaTracks] = useState<IMediaTracks>({
    audioTrack: null,
    screenTrack: null,
    screenAudioTrack: null,
    videoTrack: null,
  });

  const multiPeersManager = useRef<IPeers | null>(null);

  const applyMediaConstraintsTransformations = (
    constraints: MediaStreamConstraints,
  ) => {
    if (constraints.audio) {
      constraints.audio = {
        noiseSuppression: true,
        echoCancellation: true,
      };
    }
    return constraints;
  };

  const grabMediaStreamTracks = async ({
    type,
    constraints,
  }: getMediaProps) => {
    const acceptedMedia = {
      "user-media": async (constraints: MediaStreamConstraints) => {
        try {
          constraints = applyMediaConstraintsTransformations(constraints);
          const media = await navigator.mediaDevices.getUserMedia(constraints);

          const userTrack = {
            audio: media.getAudioTracks()[0],
            video: media.getVideoTracks()[0],
          };

          return userTrack;
        } catch (error) {
          console.error(error);
        }
      },
      "display-media": async (constraints: MediaStreamConstraints) => {
        try {
          const media =
            await navigator.mediaDevices.getDisplayMedia(constraints);

          const screenTrack = {
            audio: media.getAudioTracks()[0],
            video: media.getVideoTracks()[0],
          };

          return screenTrack;
        } catch (error) {
          console.error(error);
        }
      },
    };

    const functionMedia = acceptedMedia[type];

    if (!functionMedia) return;

    return await functionMedia(constraints);
  };

  const addStream = ({
    stream,
    remotePeerId,
  }: {
    stream: MediaStream;
    remotePeerId: string;
  }) => {
    dispatchPeers(addPeerStreamAction(remotePeerId, stream));
  };

  function determineVideoTrack(
    screenTrack: MediaStreamTrack | null,
    videoTrack: MediaStreamTrack | null,
  ) {
    if (screenTrack && screenTrack.enabled) {
      return screenTrack;
    } else {
      return videoTrack;
    }
  }

  const updateUserMediaTracks = () => {
    const audioTrack = mediaTracks.audioTrack;
    const screenAudioTrack = mediaTracks.screenAudioTrack;
    const screenTrack = mediaTracks.screenTrack;
    const videoTrack = mediaTracks.videoTrack;

    const principalVideoTrack = determineVideoTrack(screenTrack, videoTrack);

    return multiPeersManager.current?.updateMediaTracks({
      mediaTracks: {
        audioTrack,
        screenAudioTrack,
        videoTrack: principalVideoTrack,
      },
    });
  };

  const disableTrack = (mediaTrackType: removeTrackProps) => {
    const mediaTrack = mediaTracks[mediaTrackType];

    if (!mediaTrack) return false;

    mediaTrack.enabled = false;

    setMediaTracks((prev) => ({
      ...prev,
      [mediaTrackType]: mediaTrack,
    }));

    return true;
  };

  const enableUserTrack = async ({
    mediaTrackType,
    constraints,
  }: enableUserTrackProps) => {
    let mediaTrack = mediaTracks[mediaTrackType];

    if (mediaTrack) {
      mediaTrack.enabled = true;
      setMediaTracks((prev) => ({
        ...prev,
        [mediaTrackType]: mediaTrack,
      }));

      return true;
    }

    const trackType = constraints.audio ? "audio" : "video";

    try {
      const tracks = await grabMediaStreamTracks({
        type: "user-media",
        constraints: constraints,
      });

      if (!tracks || !tracks[trackType]) {
        console.log(
          `Não foi possível pegar a faixa ${mediaTrackType} do usuário`,
        );
        return false;
      }

      mediaTrack = tracks[trackType];
      mediaTrack.enabled = true;

      setMediaTracks((prev) => ({
        ...prev,
        [mediaTrackType]: mediaTrack,
      }));

      return true;
    } catch (error) {
      console.error(`Erro ao obter a faixa ${mediaTrackType}: ${error}`);
      return false;
    }
  };

  const enabledDisplayTrack = async () => {
    let mediaVideoTrack = mediaTracks["screenTrack"];
    let mediaAudioTrack = mediaTracks["screenAudioTrack"];

    try {
      const tracks = await grabMediaStreamTracks({
        type: "display-media",
        constraints: { audio: true, video: true },
      });

      if (!tracks || !tracks["video"]) {
        console.log(
          `Não foi possível pegar o compartilhamento de tela do usuário`,
        );
        return false;
      }

      mediaVideoTrack = tracks.video;

      setMediaTracks((prev) => ({
        ...prev,
        ["screenTrack"]: mediaVideoTrack,
      }));

      if (tracks["audio"]) {
        mediaAudioTrack = tracks.audio;

        setMediaTracks((prev) => ({
          ...prev,
          ["screenAudioTrack"]: mediaAudioTrack,
        }));
      }

      return true;
    } catch (error) {
      console.error(`Erro ao obter o compartilhamento de tela: ${error}`);
      return false;
    }
  };

  const peerJoined = async (peer: IPeer) => {
    multiPeersManager.current?.startCall({
      remotePeerId: peer.user.id,
      mediaTracks,
    });
  };

  const endCall = (peerId: string) => {
    multiPeersManager.current?.close(peerId);
  };

  const handleMicOn = async () => {
    const mediaTrackType = "audioTrack";
    const isMicEnabled = !mediaTracks.audioTrack?.enabled;

    const success = isMicEnabled
      ? await enableUserTrack({ mediaTrackType, constraints: { audio: true } })
      : disableTrack(mediaTrackType);

    if (success) {
      ws.emit("mediaDeviceStatusUpdate", {
        roomId: room?.id,
        type: "microphone",
        enabled: isMicEnabled,
      });
    }
  };

  const handleWebCamOn = async () => {
    const mediaTrackType = "videoTrack";
    const isWebCamEnabled = !mediaTracks.videoTrack?.enabled;

    const success = isWebCamEnabled
      ? await enableUserTrack({ mediaTrackType, constraints: { video: true } })
      : disableTrack(mediaTrackType);

    if (success) {
      ws.emit("mediaDeviceStatusUpdate", {
        roomId: room?.id,
        type: "web-cam",
        enabled: isWebCamEnabled,
      });
    }
  };

  const handleScreenOn = async () => {
    const screenTrackEnabled = !mediaTracks.screenTrack?.enabled;

    let success: boolean;

    if (screenTrackEnabled) {
      success = await enabledDisplayTrack();
    } else {
      success = disableTrack("screenTrack");
      disableTrack("screenAudioTrack");
    }

    if (success) {
      ws.emit("mediaDeviceStatusUpdate", {
        roomId: room?.id,
        type: "sharing-screen",
        enabled: screenTrackEnabled,
      });
    }
  };

  useEffect(() => {
    multiPeersManager.current = Peers();

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
    if (!room?.id || !isEnteredRoom) return;

    handleMicOn();
  }, [room?.id, isEnteredRoom]);

  useEffect(() => {
    const mediaStream = updateUserMediaTracks();

    if (!mediaStream) return;

    localStream.current = mediaStream;
  }, [mediaTracks]);

  return (
    <StreamContext.Provider
      value={{
        localStream,
        mediaTracks,
        handleMicOn,
        handleWebCamOn,
        handleScreenOn,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};
