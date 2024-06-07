import clsx from "clsx";
import { useContext } from "react";

import { RoomV2Context } from "../../context/RoomV2Context";
import { UserV2Context } from "../../context/UserV2Context";

export const ChatBubble: React.FC<{
  message: IMessage;
  prevMessage: IMessage;
}> = ({ message, prevMessage }) => {
  const { peers } = useContext(RoomV2Context);
  const { user } = useContext(UserV2Context);
  const peerExists = peers[message.userId];

  const name = (peerExists && peerExists.user?.name) || message.name;
  const lastName =
    (peerExists && peerExists.user?.lastName) || message.lastName;
  const picture = (peerExists && peerExists.user?.picture) || message.picture;

  const isPrevMessageSameAuthor =
    prevMessage && prevMessage.userId === message.userId;
  const isSelf = message.userId === user?.id;

  const prevMessageTime =
    prevMessage &&
    new Date(prevMessage.timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const time = new Date(message.timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isPrevMessageSameTime = prevMessageTime === time;

  return (
    <div
      data-testid="message"
      className={clsx("flex w-full ", {
        "flex-row-reverse": isSelf,
      })}
    >
      <div className="mt-2 max-h-11 w-11 shrink-0 overflow-hidden rounded-full">
        {!isPrevMessageSameAuthor && <img src={picture} />}
      </div>
      <div
        className={clsx(
          " flex min-w-0 grow flex-col gap-1 break-words rounded-xl bg-white px-3 py-2 dark:bg-darkBlue-900",
          {
            "mr-4": isSelf,
            "ml-4": !isSelf,
          },
        )}
      >
        {!isPrevMessageSameAuthor && (
          <div className={clsx("text-xs text-[#AFAFAF]")}>
            {isSelf ? (
              <span>Você</span>
            ) : (
              <>
                <span>{name}</span> <span>{lastName}</span>
              </>
            )}
          </div>
        )}
        <div className="font-normal leading-7 text-darkBlue-650 dark:text-blue-100 ">
          {message.content}
        </div>
      </div>
      <div
        className={clsx("mb-auto mt-auto w-[3ch] shrink-0", {
          "mr-3": isSelf,
          "ml-3": !isSelf,
        })}
      >
        <span className="text-xs text-gray-500">
          {(!isPrevMessageSameTime || !isPrevMessageSameAuthor) && time}
        </span>
      </div>
    </div>
  );
};
