import { useState } from "react";
import { useDisplayMediaTracks } from "./useDisplayMedia";
import { useIsEnteredRoom } from "./useRoomStore";
import { useUserMediaTracks } from "./useUserMedia";

export const useUserMediaControls = () => {
  const [enabledUserAudio, setEnabledUserAudio] = useState<boolean>(true);
  const [enabledUserVideo, setEnabledUserVideo] = useState<boolean>(false);
  const isEnteredRoom = useIsEnteredRoom();
  const {
    data: userMediaTracks,
    error: userMediaError,
    isFetching: isLoading,
  } = useUserMediaTracks({
    constraints: {
      audio: enabledUserAudio,
      video: enabledUserVideo,
    },
    enabled: isEnteredRoom && (enabledUserAudio || enabledUserVideo),
  });

  if (userMediaError) {
    console.error("Failed to get user media", userMediaError);
    if (!!userMediaTracks?.audio != enabledUserAudio)
      setEnabledUserAudio(!!userMediaTracks?.audio);
    if (!!userMediaTracks?.video != enabledUserVideo)
      setEnabledUserVideo(!!userMediaTracks?.video);
  }

  return {
    isLoading,
    enabledUserAudio,
    toggleUserAudio: () => setEnabledUserAudio((prev) => !prev),
    enabledUserVideo,
    toggleUserVideo: () => setEnabledUserVideo((prev) => !prev),
    userMediaTracks,
    userMediaError,
  };
};

export const useDisplayMediaControls = () => {
  const [enabledSharingScreen, setEnabledSharingScreen] =
    useState<boolean>(false);
  const isEnteredRoom = useIsEnteredRoom();

  const toggleSharingScreen = () => {
    setEnabledSharingScreen((prev) => !prev);
  };

  const {
    data: displayMediaTracks,
    error: displayMediaError,
    isFetching: isLoading,
  } = useDisplayMediaTracks({
    constraints: {
      audio: enabledSharingScreen,
      video: enabledSharingScreen,
    },
    enabled: isEnteredRoom && enabledSharingScreen,
  });

  if (displayMediaError) {
    console.error("Failed to get display media", displayMediaError);
    if (!!displayMediaTracks?.video != enabledSharingScreen)
      setEnabledSharingScreen(!!displayMediaTracks?.video);
  }

  return {
    isLoading,
    enabledSharingScreen,
    toggleSharingScreen,
    displayMediaTracks,
    displayMediaError,
  };
};
