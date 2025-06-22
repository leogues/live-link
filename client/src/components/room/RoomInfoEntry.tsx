import { useNavigate } from 'react-router-dom';

import { useThisRoom } from '../../hooks/useRoom';
import { useRoomActions } from '../../hooks/useRoomStore';
import { formatDate } from '../../utils/dateUtils';
import { MeetingButtons } from '../home/MeetingButtons';
import Layout from '../layout/Layout';

export const RoomInfoEntry: React.FC = () => {
  const { data: room } = useThisRoom();
  const { toggleEnteredRoom } = useRoomActions();

  const navigate = useNavigate();

  const redirectHomeHandle = () => {
    navigate('../');
  };

  const createAtFormated = !!room ? formatDate(room.createdAt) : null;

  return (
    <Layout>
      <div className="flex flex-col">
        <span className="text-center text-2xl text-gray-850 dark:text-[#E2E2E2]">
          {room?.topic}
        </span>
        <span className="mt-4 text-center text-gray-400 dark:text-[#9F9F9F]">
          {createAtFormated}
        </span>

        <MeetingButtons
          leftButtonText="Voltar para home"
          leftButtonHandle={redirectHomeHandle}
          rightButtonText="Entrar"
          rightButtonHandle={toggleEnteredRoom}
        />
      </div>
    </Layout>
  );
};
