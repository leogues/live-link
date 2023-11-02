// import { useContext } from "react";
// import { RoomContext } from "../../context/RoomContext";
// import clsx from "clsx";
// import { UserContext } from "../../context/UserContext";

// export const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
//   const { peers } = useContext(RoomContext);
//   const { userId } = useContext(UserContext);
//   const author = message.author && peers[message.author]?.userName;
//   const userName = author || "Anonimus";
//   const isSelf = message.author === userId;

//   const time = new Date(message.timestamp).toLocaleTimeString("pt-BR", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   return (
//     <div
//       className={clsx("m-2 flex", {
//         "justify-end pl-10": isSelf,
//         "justify-start pr-10": !isSelf,
//       })}
//     >
//       <div className="flex flex-col">
//         <div
//           className={clsx("inline-block rounded px-4 py-2", {
//             "bg-violet-200": isSelf,
//             "bg-violet-300": !isSelf,
//           })}
//         >
//           {message.content}
//           <div
//             className={clsx("text-xs opacity-50", {
//               "text-left": isSelf,
//               "text-right": !isSelf,
//             })}
//           >
//             {time}
//           </div>
//         </div>
//         <div
//           className={clsx("text-md", {
//             "text-right": isSelf,
//             "text-left": !isSelf,
//           })}
//         >
//           {isSelf ? "You" : userName}
//         </div>
//       </div>
//     </div>
//   );
// };
