import {
  MutableRefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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

type IMediaTrack = {
  enabled: boolean;
  track: MediaStreamTrack | null;
};

type IMediaTracks = {
  audioTrack: IMediaTrack;
  videoTrack: IMediaTrack;
  screenTrack: IMediaTrack;
  screenAudioTrack: IMediaTrack;
};

interface StreamValue {
  localStream: MutableRefObject<MediaStream | undefined>;
  mediaTracks: {
    audioTrack: {
      enabled: boolean;
      track: MediaStreamTrack | null;
    };
    videoTrack: {
      enabled: boolean;
      track: MediaStreamTrack | null;
    };
    screenTrack: {
      enabled: boolean;
      track: MediaStreamTrack | null;
    };
    screenAudioTrack: {
      enabled: boolean;
      track: MediaStreamTrack | null;
    };
  };
  handleMicOn: () => void;
  handleWebCamOn: () => void;
  handleScreenOn: () => void;
}

export const StreamContext = createContext<StreamValue>({
  localStream: { current: undefined },
  mediaTracks: {
    audioTrack: {
      enabled: false,
      track: null,
    },
    screenTrack: {
      enabled: false,
      track: null,
    },
    screenAudioTrack: {
      enabled: false,
      track: null,
    },
    videoTrack: {
      enabled: false,
      track: null,
    },
  },
  handleMicOn: () => {},
  handleWebCamOn: () => {},
  handleScreenOn: () => {},
});

export const StreamProvider: React.FunctionComponent<StreamContextProps> = ({
  children,
}) => {
  const { dispatchPeers } = useContext(RoomV2Context);

  const localStream = useRef<MediaStream>();

  const [mediaTracks, setMediaTracks] = useState<IMediaTracks>({
    audioTrack: {
      enabled: true,
      track: null,
    },
    videoTrack: {
      enabled: false,
      track: null,
    },
    screenTrack: {
      enabled: false,
      track: null,
    },
    screenAudioTrack: {
      enabled: false,
      track: null,
    },
  });

  const multiPeersManager = useRef<IPeers | null>(null);

  const createMediaStream = () => {
    const newMediaStream = new MediaStream();

    if (
      mediaTracks.screenAudioTrack.enabled &&
      mediaTracks.screenAudioTrack.track
    ) {
      newMediaStream.addTrack(mediaTracks.screenAudioTrack.track);
    }

    if (mediaTracks.screenTrack.enabled && mediaTracks.screenTrack.track) {
      newMediaStream.addTrack(mediaTracks.screenTrack.track);
    }

    if (mediaTracks.audioTrack.enabled && mediaTracks.audioTrack.track) {
      newMediaStream.addTrack(mediaTracks.audioTrack.track);
    }

    if (mediaTracks.videoTrack.enabled && mediaTracks.videoTrack.track) {
      newMediaStream.addTrack(mediaTracks.videoTrack.track);
    }

    return newMediaStream;
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

          return mediaTrack;
        } catch (error) {
          console.error(error);
        }
      },
      "display-media": async (constraints: MediaStreamConstraints) => {
        const media = await navigator.mediaDevices.getDisplayMedia(constraints);

        const screenTrack = {
          audio: media.getAudioTracks()[0],
          video: media.getVideoTracks()[0],
        };

        return screenTrack;
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

  const disableTrack = (mediaTrackType: removeTrackProps) => {
    const mediaTrack = mediaTracks[mediaTrackType];

    mediaTrack.enabled = false;

    if (
      mediaTrackType === "screenTrack" ||
      mediaTrackType === "screenAudioTrack"
    ) {
      mediaTrack.track = null;
    }

    setMediaTracks((prev) => ({
      ...prev,
      [mediaTrackType]: mediaTrack,
    }));
  };

  const enableUserTrack = async ({
    mediaTrackType,
    constraints,
  }: enableUserTrackProps) => {
    const mediaTrack = mediaTracks[mediaTrackType];

    if (mediaTrack.track) {
      mediaTrack.enabled = true;
      setMediaTracks((prev) => ({
        ...prev,
        [mediaTrackType]: mediaTrack,
      }));

      return;
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
        return;
      }

      mediaTrack.track = tracks[trackType];
      mediaTrack.enabled = true;

      setMediaTracks((prev) => ({
        ...prev,
        [mediaTrackType]: mediaTrack,
      }));
    } catch (error) {
      console.error(`Erro ao obter a faixa ${mediaTrackType}: ${error}`);
    }
  };

  const enabledDisplayTrack = async () => {
    const mediaVideoTrack = mediaTracks["screenTrack"];
    const mediaAudioTrack = mediaTracks["screenAudioTrack"];

    try {
      const tracks = await grabMediaStreamTracks({
        type: "display-media",
        constraints: { audio: true, video: true },
      });

      if (!tracks || !tracks["video"]) {
        console.log(`Não foi possível pegar a faixa share screen do usuário`);
        return;
      }

      mediaVideoTrack.track = tracks.video;
      mediaVideoTrack.enabled = true;

      setMediaTracks((prev) => ({
        ...prev,
        ["screenTrack"]: mediaVideoTrack,
      }));

      if (tracks["audio"]) {
        mediaAudioTrack.track = tracks.audio;
        mediaAudioTrack.enabled = true;

        setMediaTracks((prev) => ({
          ...prev,
          ["screenAudioTrack"]: mediaAudioTrack,
        }));
      }
    } catch (error) {
      console.error(`Erro ao obter a faixa screen sharing: ${error}`);
    }
  };

  const peerJoined = async (peer: IPeer) => {
    console.log("joined:", peer.user.id);

    multiPeersManager.current?.startCall({
      remotePeerId: peer.user.id,
      stream: localStream.current,
    });
  };

  const endCall = (peerId: string) => {
    console.log("end call:", peerId);

    multiPeersManager.current?.close(peerId);
  };

  const handleMicOn = () => {
    const mediaTrackType = "audioTrack";
    const toggleMic = !mediaTracks.audioTrack.enabled;

    if (toggleMic) {
      enableUserTrack({ mediaTrackType, constraints: { audio: true } });
    } else {
      disableTrack(mediaTrackType);
    }
  };

  const handleWebCamOn = () => {
    const mediaTrackType = "videoTrack";
    const toggleWebCam = !mediaTracks.videoTrack.enabled;

    if (toggleWebCam) {
      enableUserTrack({ mediaTrackType, constraints: { video: true } });
    } else {
      disableTrack(mediaTrackType);
    }
  };

  const handleScreenOn = () => {
    const toggleScreenSharing = !mediaTracks.screenTrack.enabled;

    if (toggleScreenSharing) {
      enabledDisplayTrack();
    } else {
      disableTrack("screenTrack");
      disableTrack("screenAudioTrack");
    }
  };

  useEffect(() => {
    console.log("render Stream");
    multiPeersManager.current = Peers();

    enableUserTrack({
      mediaTrackType: "audioTrack",
      constraints: { audio: true },
    });

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

  useEffect(() => {}, [mediaTracks]);

  localStream.current = createMediaStream();

  console.log(mediaTracks);

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
