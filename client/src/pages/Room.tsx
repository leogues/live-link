import { useEffect } from 'react';

import { RoomContent } from '../components/room/RoomContent';
import { RoomFooter } from '../components/room/RoomFooter';
import { RoomHeader } from '../components/room/RoomHeader';
import { RoomInfoEntry } from '../components/room/RoomInfoEntry';
import { useThisRoom } from '../hooks/useRoom';
import { useIsEnteredRoom } from '../hooks/useRoomStore';
import { useMeQuery } from '../hooks/useUser';
import { ws } from '../services/ws';

export const Room = () => {
  const { data: room, isLoading: roomIsLoading } = useThisRoom();
  const { isLoading: userIsLoading } = useMeQuery();
  const isEnteredRoom = useIsEnteredRoom();

  useEffect(() => {
    if (room && isEnteredRoom) {
      ws.emit('join-room', {
        roomId: room?.id,
      });

      return () => {
        ws.emit('leave-room', { roomId: room.id });
      };
    }
  }, [room, isEnteredRoom]);

  //TODO: Chrome autoplay videos https://developer.chrome.com/blog/autoplay/
  if (userIsLoading || roomIsLoading) return null;
  if (!isEnteredRoom) return <RoomInfoEntry />;

  return (
    <div className="grid h-[100dvh] max-h-[100dvh] grid-rows-[3rem_1fr_4rem] font-medium text-white lg:grid-rows-[6rem_1fr_8rem]">
      <RoomHeader />
      <RoomContent />
      <RoomFooter />
    </div>
  );
};
