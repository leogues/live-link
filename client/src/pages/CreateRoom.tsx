import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { FormHeader } from "../components/FormHeader";
import { Header } from "../components/Header";
import { MeetingButtons } from "../components/home/MeetingButtons";
import { MeetingInput } from "../components/home/MeetingInput";
import api from "../services/api";

export const CreateRoom = () => {
  const inputRoomTopicRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const redirectHomeHandle = () => {
    navigate("../");
  };

  const createRoomHandle = async () => {
    const topic = inputRoomTopicRef.current?.value;

    if (!topic) return;

    const response = await api.post("./room", { topic });
    const room = response.data;

    if (!room) return;

    navigate("../room/" + room.id);
  };

  return (
    <div className="mx-auto my-0 flex h-screen flex-col">
      <Header />
      <div className="font-family flex flex-grow items-center justify-center text-gray-850 dark:text-gray-300">
        <div className="w-[95%] max-w-xs rounded-md bg-white p-6 shadow-md dark:bg-darkBlue-900 sm:max-w-sm sm:px-10 sm:py-8">
          <FormHeader title="Crie uma reunião" />
          <div className="mt-10">
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
        </div>
      </div>
    </div>
  );
};
