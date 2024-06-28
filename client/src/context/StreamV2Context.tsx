import {
  createContext,
  FC,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useDisplayMediaControls,
  useUserMediaControls,
} from "../hooks/useMediaControls";
import { addPeerStreamAction } from "../reducers/peersActions";
import { ws } from "../services/ws";
import { IPeer } from "../types/peer";
import { IPeers, Peers } from "../utils/multiPeerManager";
import { RoomV2Context } from "./RoomV2Context";

type IMediaTracks = {
  audioTrack: MediaStreamTrack | undefined;
  screenTrack: MediaStreamTrack | undefined;
  screenAudioTrack: MediaStreamTrack | undefined;
  videoTrack: MediaStreamTrack | undefined;
};

export type StreamContextValue = {
  localStream: MutableRefObject<MediaStream | undefined>;
  mediaTracks: IMediaTracks;
  handleMicOn: () => void;
  handleWebCamOn: () => void;
  handleScreenOn: () => void;
};

export const StreamContext = createContext<StreamContextValue>({
  localStream: { current: undefined },
  mediaTracks: {
    audioTrack: undefined,
    screenTrack: undefined,
    screenAudioTrack: undefined,
    videoTrack: undefined,
  },
  handleMicOn: () => {},
  handleWebCamOn: () => {},
  handleScreenOn: () => {},
});

export const StreamProvider: FC<PropsWithChildren> = ({ children }) => {
  const { room, dispatchPeers } = useContext(RoomV2Context);
  const [mediaTracks, setMediaTracks] = useState<IMediaTracks>({
    audioTrack: undefined,
    screenTrack: undefined,
    screenAudioTrack: undefined,
    videoTrack: undefined,
  });
  const {
    userMediaTracks,
    toggleUserAudio,
    toggleUserVideo,
    isLoading: userMediaIsLoading,
  } = useUserMediaControls();
  const {
    displayMediaTracks,
    toggleSharingScreen,
    isLoading: displayMediaIsLoading,
  } = useDisplayMediaControls();
  const multiPeersManager = useRef<IPeers | null>(null);
  const localStream = useRef<MediaStream>(new MediaStream());
  const mediaTracksServeState = useRef<IMediaTracks>({
    audioTrack: undefined,
    screenTrack: undefined,
    screenAudioTrack: undefined,
    videoTrack: undefined,
  });

  const determineVideoTrack = (
    screenTrack: MediaStreamTrack | undefined,
    videoTrack: MediaStreamTrack | undefined,
  ) => {
    if (screenTrack && screenTrack.enabled) {
      return screenTrack;
    } else {
      return videoTrack;
    }
  };

  const updateUserMediaTracks = () => {
    const audioTrack = mediaTracks.audioTrack || null;
    const screenAudioTrack = mediaTracks.screenAudioTrack || null;
    const screenTrack = mediaTracks.screenTrack;
    const videoTrack = mediaTracks.videoTrack;

    const principalVideoTrack =
      determineVideoTrack(screenTrack, videoTrack) || null;

    return multiPeersManager.current!.updateMediaTracks({
      mediaTracks: {
        audioTrack,
        screenAudioTrack,
        videoTrack: principalVideoTrack,
      },
    });
  };

  const addStream = ({
    stream,
    remotePeerId,
  }: {
    stream: MediaStream;
    remotePeerId: string;
  }) => {
    console.log({ remotePeerId, stream });
    dispatchPeers(addPeerStreamAction(remotePeerId, stream));
  };

  const peerJoined = async (peer: IPeer) => {
    multiPeersManager.current?.startCall({
      remotePeerId: peer.user.id,
      mediaTracks: {
        audioTrack: mediaTracks.audioTrack || null,
        videoTrack:
          determineVideoTrack(
            mediaTracks.screenTrack,
            mediaTracks.videoTrack,
          ) || null,

        screenAudioTrack: mediaTracks.screenAudioTrack || null,
      },
    });
  };

  const endCall = (peerId: string) => {
    multiPeersManager.current?.close(peerId);
  };

  useEffect(() => {
    multiPeersManager.current = Peers();

    multiPeersManager.current?.on("stream", addStream);
    ws.on("call-new-user", peerJoined);
    ws.on("end-call", endCall);
    return () => {
      multiPeersManager.current?.off("stream");
      ws.off("call-new-user");
      ws.off("end-call");
      multiPeersManager.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (userMediaIsLoading || displayMediaIsLoading) return;

    setMediaTracks({
      audioTrack: userMediaTracks?.audio,
      videoTrack: userMediaTracks?.video,
      screenTrack: displayMediaTracks?.video,
      screenAudioTrack: displayMediaTracks?.audio,
    });
  }, [
    userMediaTracks,
    displayMediaTracks,
    userMediaIsLoading,
    displayMediaIsLoading,
  ]);

  useEffect(() => {
    if (userMediaIsLoading || displayMediaIsLoading) return;
    localStream.current = updateUserMediaTracks();
  }, [mediaTracks, userMediaIsLoading, displayMediaIsLoading]);

  useEffect(() => {
    if (userMediaIsLoading || displayMediaIsLoading) return;
    const { audioTrack, videoTrack, screenTrack } = mediaTracks;
    const prevAudioTrack = mediaTracksServeState.current.audioTrack;
    const prevVideoTrack = mediaTracksServeState.current.videoTrack;
    const prevScreenTrack = mediaTracksServeState.current.screenTrack;

    const isMicEnabled = audioTrack !== undefined;
    const wasMicEnabled = prevAudioTrack !== undefined;
    const isWebCamEnabled = videoTrack !== undefined;
    const wasWebCamEnabled = prevVideoTrack !== undefined;
    const screenTrackEnabled = screenTrack !== undefined;
    const wasScreenTrackEnabled = prevScreenTrack !== undefined;

    if (isMicEnabled !== wasMicEnabled) {
      ws.emit("mediaDeviceStatusUpdate", {
        roomId: room?.id,
        type: "microphone",
        enabled: isMicEnabled,
      });
    }

    if (isWebCamEnabled !== wasWebCamEnabled) {
      ws.emit("mediaDeviceStatusUpdate", {
        roomId: room?.id,
        type: "web-cam",
        enabled: isWebCamEnabled,
      });
    }

    if (screenTrackEnabled !== wasScreenTrackEnabled) {
      ws.emit("mediaDeviceStatusUpdate", {
        roomId: room?.id,
        type: "sharing-screen",
        enabled: screenTrackEnabled,
      });
    }

    mediaTracksServeState.current = mediaTracks;
  }, [mediaTracks, room?.id, userMediaIsLoading, displayMediaIsLoading]);

  return (
    <StreamContext.Provider
      value={{
        localStream,
        mediaTracks,
        handleMicOn: toggleUserAudio,
        handleWebCamOn: toggleUserVideo,
        handleScreenOn: toggleSharingScreen,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};
