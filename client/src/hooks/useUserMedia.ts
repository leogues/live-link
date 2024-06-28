import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { applyMediaConstraintsTransformations } from "../utils/media";

export type SelectFunc<TData, TResult> = (data: TData) => TResult;

const getUserMediaStream = async (
  constraints: MediaStreamConstraints,
): Promise<MediaStream> => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  return stream;
};

type UserMediaOptions<TResult> = {
  constraints: MediaStreamConstraints;
  enabled: boolean;
  select: SelectFunc<MediaStream, TResult>;
};

export const useUserMedia = <TResult>({
  constraints,
  enabled,
  select,
}: UserMediaOptions<TResult>): UseQueryResult<TResult> =>
  useQuery({
    queryKey: ["userMedia", constraints],
    queryFn: () => getUserMediaStream(constraints),
    select,
    enabled,
    staleTime: Infinity,
    cacheTime: 0,
    retry: false,
  });

type UserMediaTracksOptions = {
  constraints: MediaStreamConstraints;
  enabled: boolean;
};

export const useUserMediaTracks = ({
  constraints,
  enabled,
}: UserMediaTracksOptions) => {
  constraints = applyMediaConstraintsTransformations(constraints);
  return useUserMedia({
    constraints,
    enabled,
    select: (data) => ({
      audio: data.getAudioTracks()[0],
      video: data.getVideoTracks()[0],
    }),
  });
};
