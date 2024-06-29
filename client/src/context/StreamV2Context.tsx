import {
  createContext,
  FC,
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  useDisplayMediaControls,
  useUserMediaControls,
} from "../hooks/useMediaControls";
import { useThisRoom } from "../hooks/useRoom";
import { useRoomActions } from "../hooks/useRoomStore";
import { ws } from "../services/ws";
import { IMediaTracks } from "../types/media";
import { IPeer } from "../types/peer";
import { formatMediaTracks } from "../utils/media";
import { IPeers, Peers } from "../utils/multiPeerManager";

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
  const { addPeerStream } = useRoomActions();
  const { data: room } = useThisRoom();
  const multiPeersManager = useRef<IPeers | null>(null);
  const localStream = useRef<MediaStream>(new MediaStream());
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
  const mediaTracksServeState = useRef<IMediaTracks>({
    audioTrack: undefined,
    screenTrack: undefined,
    screenAudioTrack: undefined,
    videoTrack: undefined,
  });

  const mediaTracks = useMemo(() => {
    if (userMediaIsLoading || displayMediaIsLoading)
      return mediaTracksServeState.current;
    return {
      audioTrack: userMediaTracks?.audio,
      videoTrack: userMediaTracks?.video,
      screenTrack: displayMediaTracks?.video,
      screenAudioTrack: displayMediaTracks?.audio,
    };
  }, [
    userMediaTracks,
    displayMediaTracks,
    userMediaIsLoading,
    displayMediaIsLoading,
  ]);

  const updateUserMediaTracks = () => {
    return multiPeersManager.current!.updateMediaTracks({
      mediaTracks: formatMediaTracks(mediaTracks),
    });
  };

  const addStream = ({
    stream,
    remotePeerId,
  }: {
    stream: MediaStream;
    remotePeerId: string;
  }) => {
    addPeerStream(remotePeerId, stream);
  };

  const peerJoined = async (peer: IPeer) => {
    multiPeersManager.current?.startCall({
      remotePeerId: peer.user.id,
      mediaTracks: formatMediaTracks(mediaTracks),
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
    localStream.current = updateUserMediaTracks();
  }, [mediaTracks, userMediaIsLoading, displayMediaIsLoading]);

  useEffect(() => {
    if (userMediaIsLoading || displayMediaIsLoading) return;
    const { audioTrack, videoTrack, screenTrack } = mediaTracks;
    const {
      audioTrack: prevAudioTrack,
      videoTrack: prevVideoTrack,
      screenTrack: prevScreenTrack,
    } = mediaTracksServeState.current;

    const checkAndEmitStatusUpdate = (
      type: string,
      prevTrack: MediaStreamTrack | undefined,
      currentTrack: MediaStreamTrack | undefined,
    ) => {
      const isEnabled = currentTrack !== undefined;
      const wasEnabled = prevTrack !== undefined;

      if (isEnabled !== wasEnabled) {
        ws.emit("mediaDeviceStatusUpdate", {
          roomId: room?.id,
          type,
          enabled: isEnabled,
        });
      }
    };
    checkAndEmitStatusUpdate("microphone", prevAudioTrack, audioTrack);
    checkAndEmitStatusUpdate("web-cam", prevVideoTrack, videoTrack);
    checkAndEmitStatusUpdate("sharing-screen", prevScreenTrack, screenTrack);

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
