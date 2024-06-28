import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { SelectFunc } from "./useUserMedia";

const getDisplayMediaStream = async (
  constraints: MediaStreamConstraints,
): Promise<MediaStream> => {
  const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
  return stream;
};

export type DisplayMediaOptions<TResult> = {
  constraints: MediaStreamConstraints;
  enabled: boolean;
  select: SelectFunc<MediaStream, TResult>;
};

export const useDisplayMedia = <TResult>({
  constraints,
  enabled,
  select,
}: DisplayMediaOptions<TResult>): UseQueryResult<TResult> =>
  useQuery({
    queryKey: ["displayMedia", constraints],
    queryFn: () => getDisplayMediaStream(constraints),
    select,
    enabled,
    staleTime: Infinity,
    cacheTime: 0,
    retry: false,
  });

type DisplayMediaTracksOptions = {
  constraints: MediaStreamConstraints;
  enabled: boolean;
};

export const useDisplayMediaTracks = ({
  constraints,
  enabled,
}: DisplayMediaTracksOptions) =>
  useDisplayMedia({
    constraints,
    enabled,
    select: (data) => ({
      audio: data.getAudioTracks()[0],
      video: data.getVideoTracks()[0],
    }),
  });
