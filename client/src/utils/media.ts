import { IMediaTracks } from '../types/media';

export const applyMediaConstraintsTransformations = (
  constraints: MediaStreamConstraints
) => {
  if (constraints.audio) {
    constraints.audio = {
      noiseSuppression: true,
      echoCancellation: true,
    };
  }

  return constraints;
};

export const determineVideoTrack = (
  screenTrack: MediaStreamTrack | undefined,
  videoTrack: MediaStreamTrack | undefined
) => {
  if (screenTrack && screenTrack.enabled) {
    return screenTrack;
  } else {
    return videoTrack;
  }
};

export const formatMediaTracks = (mediaTracks: IMediaTracks) => {
  const audioTrack = mediaTracks.audioTrack || null;
  const screenAudioTrack = mediaTracks.screenAudioTrack || null;
  const screenTrack = mediaTracks.screenTrack;
  const videoTrack = mediaTracks.videoTrack;

  const principalVideoTrack =
    determineVideoTrack(screenTrack, videoTrack) || null;

  return {
    audioTrack,
    screenAudioTrack,
    videoTrack: principalVideoTrack,
  };
};
