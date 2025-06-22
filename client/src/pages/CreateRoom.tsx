import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormHeader } from '../components/FormHeader';
import { MeetingButtons } from '../components/home/MeetingButtons';
import { MeetingInput } from '../components/home/MeetingInput';
import Layout from '../components/layout/Layout';
import { useNotification } from '../hooks/useNotification';
import api from '../services/api';

export const CreateRoom = () => {
  const inputRoomTopicRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const notify = useNotification();

  const redirectHomeHandle = () => {
    navigate('../');
  };

  const createRoomHandle = async () => {
    const topic = inputRoomTopicRef.current?.value;

    if (!topic) {
      notify({
        message: 'Insira o tópico da reunião',
        duration: 3000,
      });
    }

    const response = await api.post('./room', { topic });
    const room = response.data;

    if (!room) return;

    navigate('../room/' + room.id);
  };

  return (
    <Layout size="sm">
      <FormHeader title="Crie uma reunião" />
      <div className="mt-6 md:mt-10">
        <MeetingInput
          inputRef={inputRoomTopicRef}
          placeholder="Insira o tópico da reunião"
        />
      </div>
      <footer>
        <MeetingButtons
          leftButtonText="Voltar para home"
          leftButtonHandle={redirectHomeHandle}
          rightButtonText="Criar uma reunião"
          rightButtonHandle={createRoomHandle}
        />
      </footer>
    </Layout>
  );
};
