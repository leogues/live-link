import { useEffect, useState } from "react";
import { useDisplayMediaTracks } from "./useDisplayMedia";
import { useIsEnteredRoom } from "./useRoomStore";
import { useUserMediaTracks } from "./useUserMedia";

export const useUserMediaControls = () => {
  const [enabledUserAudio, setEnabledUserAudio] = useState<boolean>(true);
  const [enabledUserVideo, setEnabledUserVideo] = useState<boolean>(false);
  const isEnteredRoom = useIsEnteredRoom();

  const toggleUserAudio = () => {
    setEnabledUserAudio((prev) => !prev);
  };

  const toggleUserVideo = () => {
    setEnabledUserVideo((prev) => !prev);
  };

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
    toggleUserAudio,
    enabledUserVideo,
    toggleUserVideo,
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

  useEffect(() => {
    if (!enabledSharingScreen) {
      displayMediaTracks?.audio?.stop();
      displayMediaTracks?.video?.stop();
    }
  }, [displayMediaTracks, enabledSharingScreen]);

  return {
    isLoading,
    enabledSharingScreen,
    toggleSharingScreen,
    displayMediaTracks,
    displayMediaError,
  };
};
