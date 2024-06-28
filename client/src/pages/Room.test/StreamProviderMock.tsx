import {
  StreamContext,
  StreamContextValue,
} from "../../context/StreamV2Context";

export type IStreamProviderProps = StreamContextValue;

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
      audioTrack: undefined,
      screenAudioTrack: undefined,
      screenTrack: undefined,
      videoTrack: undefined,
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
