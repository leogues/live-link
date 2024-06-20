import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { FormHeader } from "../components/FormHeader";
import { MeetingButtons } from "../components/home/MeetingButtons";
import { MeetingInput } from "../components/home/MeetingInput";
import Layout from "../components/layout/Layout";
import { UserProfile } from "../components/UserProfile";
import { UserV2Context } from "../context/UserV2Context";
import api from "../services/api";

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
    <Layout>
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
    </Layout>
  );
};
