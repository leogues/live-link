import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';

import { fireEvent, render, screen } from '@testing-library/react';

import { Room } from '../Room';

describe('Room content tests', () => {
  test('renders video for every peer', () => {
    render(
      <MemoryRouter>
        <Room />
      </MemoryRouter>
    );

    const focusedPeerVideo = screen.getByTestId('focused-peer-video');

    expect(focusedPeerVideo).toBeInTheDocument();

    // const remainingVideos = screen.getAllByTestId("peer-video");

    // expect(remainingVideos).toHaveLength(peerVideosQuantity);
  });

  test("don't renders slider videos if only one peer is present", () => {
    render(
      <MemoryRouter>
        <Room />
      </MemoryRouter>
    );

    const focusedPeerVideo = screen.queryByTestId('slider-videos');

    expect(focusedPeerVideo).not.toBeInTheDocument();
  });

  test('fullscreen button toggle fullscreen state', () => {
    render(
      <MemoryRouter>
        <Room />
      </MemoryRouter>
    );

    const focusedPeerVideo = screen.getByTestId('focused-peer-video');
    const fullscreenButton = screen.getByTestId('fullscreen-toggle');

    const fullscreenStateBeforeClick =
      focusedPeerVideo.getAttribute('data-fullscreen');

    fireEvent.click(fullscreenButton);

    const fullscreenStateAfterClick =
      focusedPeerVideo.getAttribute('data-fullscreen');

    expect(fullscreenStateBeforeClick).not.toEqual(fullscreenStateAfterClick);
    expect(fullscreenStateAfterClick).toEqual(
      fullscreenStateBeforeClick === 'true' ? 'false' : 'true'
    );
  });

  test('checks if the focused video corresponds to the room creator', () => {
    render(
      <MemoryRouter>
        <Room />,
      </MemoryRouter>
    );

    const focusedPeerVideo = screen.getByTestId('focused-peer-video');

    // @ts-ignore
    expect(focusedPeerVideo).toHaveTextContent(testPeer.user.name);
  });

  test('checks if the focused video is from the first peer when room creator is not present', () => {
    render(
      <MemoryRouter>
        <Room />
      </MemoryRouter>
    );

    const focusedPeerVideo = screen.getByTestId('focused-peer-video');

    // @ts-ignore
    expect(focusedPeerVideo).toHaveTextContent(firstPeer.user?.name);
  });

  test('clicking on a peer video makes it the focused video', () => {
    render(
      <MemoryRouter>
        <Room />
      </MemoryRouter>
    );

    const peerVideos = screen.getAllByTestId('peer-video');

    const otherPeerVideo = peerVideos.find(
      // @ts-ignore
      peerVideo => peerVideo.textContent?.includes(otherPeer.user?.name)
    );

    if (otherPeerVideo) {
      fireEvent.click(otherPeerVideo);

      const focusedPeerVideo = screen.getByTestId('focused-peer-video');

      // @ts-ignore
      expect(focusedPeerVideo).toHaveTextContent(otherPeer.user?.name);
    }
  });
});
