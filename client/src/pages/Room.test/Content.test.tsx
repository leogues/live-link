import { describe, test, expect } from "vitest";

import { fireEvent, render, screen } from "@testing-library/react";
import { Room } from "../Room";
import { roomCustomProviderProps, mockedPeers } from "./RoomProviderMock";
import { MemoryRouter } from "react-router-dom";
import { IRoom } from "../../context/RoomV2Context";
import { PeerState } from "../../reducers/peersReducer";

const mockRoom: IRoom = {
  id: "1",
  createdAt: "",
  topic: "",
  userId: "testid",
};

const mockPeers: PeerState = {
  test1: {
    user: {
      id: "test1",
      name: "nametest1",
      lastName: "",
      picture: "",
    },
  },
  test2: {
    user: {
      id: "test2",
      name: "nametest2",
      lastName: "",
      picture: "",
    },
  },
  testid: {
    user: {
      id: "testid",
      name: "nametestid",
      lastName: "",
      picture: "",
    },
  },
};

describe("Room content tests", () => {
  test("renders video for every peer", () => {
    const mockPeersLength = Object.keys(mockedPeers).length;
    const peerVideosQuantity = mockPeersLength - 1;

    render(
      <MemoryRouter>
        {roomCustomProviderProps({
          children: <Room />,
        })}
      </MemoryRouter>,
    );

    const focusedPeerVideo = screen.getByTestId("focused-peer-video");

    expect(focusedPeerVideo).toBeInTheDocument();

    const remainingVideos = screen.getAllByTestId("peer-video");

    expect(remainingVideos).toHaveLength(peerVideosQuantity);
  });

  test("don't renders slider videos if only one peer is present", () => {
    const peer = mockPeers.testid;

    render(
      <MemoryRouter>
        {roomCustomProviderProps({
          children: <Room />,
          providerProps: { peers: { peer } },
        })}
      </MemoryRouter>,
    );

    const focusedPeerVideo = screen.queryByTestId("slider-videos");

    expect(focusedPeerVideo).not.toBeInTheDocument();
  });

  test("fullscreen button toggle fullscreen state", () => {
    render(
      <MemoryRouter>
        {roomCustomProviderProps({
          children: <Room />,
        })}
      </MemoryRouter>,
    );

    const focusedPeerVideo = screen.getByTestId("focused-peer-video");
    const fullscreenButton = screen.getByTestId("fullscreen-toggle");

    const fullscreenStateBeforeClick =
      focusedPeerVideo.getAttribute("data-fullscreen");

    fireEvent.click(fullscreenButton);

    const fullscreenStateAfterClick =
      focusedPeerVideo.getAttribute("data-fullscreen");

    expect(fullscreenStateBeforeClick).not.toEqual(fullscreenStateAfterClick);
    expect(fullscreenStateAfterClick).toEqual(
      fullscreenStateBeforeClick === "true" ? "false" : "true",
    );
  });

  test("checks if the focused video corresponds to the room creator", () => {
    const testPeer = mockPeers.testid;

    render(
      <MemoryRouter>
        {roomCustomProviderProps({
          children: <Room />,
          providerProps: { room: mockRoom, peers: mockPeers },
        })}
      </MemoryRouter>,
    );

    const focusedPeerVideo = screen.getByTestId("focused-peer-video");

    // @ts-ignore
    expect(focusedPeerVideo).toHaveTextContent(testPeer.user.name);
  });

  test("checks if the focused video is from the first peer when room creator is not present", () => {
    const { testid, ...clonedPeersWithoutRoomCreator } = mockPeers;

    const firstPeer = clonedPeersWithoutRoomCreator["test1"];

    render(
      <MemoryRouter>
        {roomCustomProviderProps({
          children: <Room />,
          providerProps: {
            room: mockRoom,
            peers: clonedPeersWithoutRoomCreator,
          },
        })}
      </MemoryRouter>,
    );

    const focusedPeerVideo = screen.getByTestId("focused-peer-video");

    // @ts-ignore
    expect(focusedPeerVideo).toHaveTextContent(firstPeer.user?.name);
  });

  test("clicking on a peer video makes it the focused video", () => {
    const otherPeer = mockPeers.test2;

    render(
      <MemoryRouter>
        {roomCustomProviderProps({
          children: <Room />,
          providerProps: { room: mockRoom, peers: mockPeers },
        })}
      </MemoryRouter>,
    );

    const peerVideos = screen.getAllByTestId("peer-video");

    const otherPeerVideo = peerVideos.find(
      // @ts-ignore
      (peerVideo) => peerVideo.textContent?.includes(otherPeer.user?.name),
    );

    if (otherPeerVideo) {
      fireEvent.click(otherPeerVideo);

      const focusedPeerVideo = screen.getByTestId("focused-peer-video");

      // @ts-ignore
      expect(focusedPeerVideo).toHaveTextContent(otherPeer.user?.name);
    } else {
      throw new Error(`Peer video for ${otherPeer.user?.name} not found`);
    }
  });
});
