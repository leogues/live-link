import { Header } from "../components/Header";
import { useContext, useRef } from "react";
import { UserV2Context } from "../context/UserV2Context";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FormHeader } from "../components/FormHeader";
import { MeetingInput } from "../components/home/MeetingInput";
import { UserProfile } from "../components/UserProfile";
import { MeetingButtons } from "../components/home/MeetingButtons";

export const Home = () => {
  const { user } = useContext(UserV2Context);
  const inputRoomIdRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filterIdFromLink = (linkOrId: string) => {
    const parts = linkOrId.split("/");

    const id = parts[parts.length - 1];

    return id || linkOrId;
  };

  const joinButtonHandle = async () => {
    const inputRoomIdValue = inputRoomIdRef.current?.value;

    if (!inputRoomIdValue) return;

    const roomId = filterIdFromLink(inputRoomIdValue);

    const response = await api.get("./room/" + roomId);
    const room = response.data;

    if (!room) return;

    navigate("./room/" + room.id);
  };

  const createRoomHandle = () => {
    navigate("./createRoom");
  };

  return (
    <div className="mx-auto my-0 flex h-screen flex-col">
      <Header />
      <div className="font-family flex flex-grow items-center justify-center text-gray-850 dark:text-gray-300">
        <div className="w-full max-w-md rounded-md bg-white px-10 py-8 shadow-md dark:bg-darkBlue-900">
          <FormHeader title="Entre em uma reunião" />
          <MeetingInput
            inputRef={inputRoomIdRef}
            placeholder="Insira o ID da reunião ou o link"
          />
          <UserProfile user={user} className="mt-7" bgColor="transparent" />
          <MeetingButtons
            leftButtonHandle={createRoomHandle}
            leftButtonText="Crie sua reunião"
            rightButtonHandle={joinButtonHandle}
            rightButtonText="Entrar na reunião"
          />
        </div>
      </div>
    </div>
  );
};
