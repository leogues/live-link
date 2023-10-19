import { Header } from "../components/Header";
import { useContext, useRef } from "react";
import { UserV2Context } from "../context/UserV2Context";
import VectorIcon from "../assets/Vector.svg";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/common/Input";
import api from "../services/api";
import { Profile } from "../components/Profile";

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

    if (!room.id) return;

    navigate("./room/" + room.id);
  };

  const redirectCreateRoomHandle = () => {
    navigate("./createRoom");
  };

  return (
    <div className="mx-auto my-0 flex h-screen flex-col">
      <Header />
      <div className="font-family flex flex-grow items-center justify-center text-gray-850 dark:text-gray-300">
        <div className="w-full max-w-md rounded-md bg-white px-10 py-8 shadow-md dark:bg-darkBlue-900">
          <header className="flex justify-center border-b border-gray-300 pb-3">
            <h3 className="text-2xl font-medium">Entre em uma reunião</h3>
          </header>
          <div className="mt-5">
            <Input
              inputRef={inputRoomIdRef}
              placeholder="Insira o ID da reunião ou o link"
            />
          </div>
          <div className="mt-8 flex w-full items-center gap-4 px-1">
            {user && (
              <Profile
                name={user.name}
                lastName={user.lastName}
                picture={user.picture}
                bgColor="transparent"
              />
            )}
          </div>
          <div className="mt-10 flex items-center gap-2 text-sm font-semibold">
            <div className="flex flex-1 flex-col gap-2">
              <Button
                onClick={redirectCreateRoomHandle}
                className="bg-blue-50 py-3 text-blue-800 dark:bg-darkBlue-400 dark:text-blue-700"
              >
                Crie sua reunião
              </Button>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Button
                className="bg-blue-800 py-3 text-white "
                onClick={joinButtonHandle}
              >
                Entrar na reunião
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
