import { StreamContext, StreamValue } from "../../context/StreamContext";

export type IStreamProviderProps = StreamValue;

export type StreamCustomProviderProps = {
  children: any;
  providerProps: IStreamProviderProps | {};
};

export const streamCustomProviderProps = ({
  children,
  providerProps,
}: StreamCustomProviderProps) => {
  const defaultProps: IStreamProviderProps = {
    localStream: {
      current: {} as MediaStream,
    },
    mediaTracks: {
      audioTrack: null,
      screenAudioTrack: null,
      screenTrack: null,
      videoTrack: null,
    },
    handleMicOn: () => {},
    handleScreenOn: () => {},
    handleWebCamOn: () => {},
  };

  const props = { ...defaultProps, ...providerProps };

  return (
    <StreamContext.Provider value={props}>{children}</StreamContext.Provider>
  );
};
