import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { RoomV2Context } from "../../context/RoomV2Context";
import { UserV2Context } from "../../context/UserV2Context";
import { Button } from "../common/Button";

import SendIcon from "../../assets/sendMessage.svg";

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useContext(ChatContext);
  const { user } = useContext(UserV2Context);
  const { room } = useContext(RoomV2Context);

  return (
    <div className="w-full py-1 pl-4 pr-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!room || !user) return;

          sendMessage({
            roomId: room.id,
            content: message,
            userId: user.id,
            name: user.name,
            lastName: user.lastName,
            picture: user.picture,
          });
          setMessage("");
        }}
      >
        <div className="flex h-14 max-w-full items-center justify-center rounded-full bg-darkBlue-700 ">
          <textarea
            placeholder="Digite uma mensagem..."
            className="flex h-4/5 grow resize-none overflow-hidden border-0 bg-transparent px-3 py-[0.6rem] align-middle outline-none"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button type="submit" className="mr-1 rounded-full bg-blue-700 p-2">
            <img src={SendIcon} />
          </Button>
        </div>
      </form>
    </div>
  );
};
