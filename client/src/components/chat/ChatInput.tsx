import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { RoomV2Context } from "../../context/RoomV2Context";
import { UserV2Context } from "../../context/UserV2Context";
import { Button } from "../common/Button";

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useContext(ChatContext);
  const { user } = useContext(UserV2Context);
  const { room } = useContext(RoomV2Context);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!room || !user) return;

          sendMessage(message, room.id, user.id);
          setMessage("");
        }}
      >
        <div className="flex ">
          <textarea
            className="rounded border"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button
            type="submit"
            className="mx-2 rounded-lg bg-rose-400 p-4 text-xl text-white hover:bg-rose-600"
          >
            <svg
              style={{ transform: "rotate(90deg)" }}
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
};
