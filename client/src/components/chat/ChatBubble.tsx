import { useContext } from "react";
import { RoomV2Context } from "../../context/RoomV2Context";
import clsx from "clsx";
import { UserV2Context } from "../../context/UserV2Context";

export const ChatBubble: React.FC<{
  message: IMessage;
  prevMessage: IMessage;
}> = ({ message, prevMessage }) => {
  const { peers } = useContext(RoomV2Context);
  const { user } = useContext(UserV2Context);
  const name = message.name && peers[message.userId]?.user?.name;
  const lastName = message.lastName && peers[message.userId]?.user?.lastName;
  const picture = message.picture && peers[message.userId]?.user?.picture;

  const isPrevMessageSameAuthor =
    prevMessage && prevMessage.userId === message.userId;
  const isSelf = message.userId === user?.id;

  const time = new Date(message.timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={clsx("flex w-full ", {
        "flex-row-reverse": isSelf,
      })}
    >
      <div className="mt-2 h-11 w-11 shrink-0 overflow-hidden rounded-full">
        {!isPrevMessageSameAuthor && <img src={picture} />}
      </div>
      <div
        className={clsx(
          " flex min-w-0 grow flex-col gap-1 break-words rounded-xl bg-darkBlue-900 px-3 py-2",
          {
            "mr-4": isSelf,
            "ml-4": !isSelf,
          },
        )}
      >
        <div className={clsx("text-xs text-[#AFAFAF]")}>
          {isSelf ? (
            <span>Você</span>
          ) : (
            <>
              <span>{name}</span> <span>{lastName}</span>
            </>
          )}
        </div>
        <div className="font-normal leading-7 text-blue-100 ">
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
          {!isPrevMessageSameAuthor && time}
        </span>
      </div>
    </div>
  );
};
