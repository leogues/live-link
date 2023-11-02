// import { useContext } from "react";
// import { ChatContext } from "../../context/ChatContext";
// import { ChatBubble } from "./ChatBubble";
// import { ChatInput } from "./ChatInput";

// export const Chat: React.FC = () => {
//   const { chat } = useContext(ChatContext);

//   return (
//     <div className="flex h-full flex-col justify-between">
//       <div>
//         {chat.messages.map((message: IMessage) => (
//           <ChatBubble
//             message={message}
//             key={message.timestamp + (message?.author || "anonymous")}
//           />
//         ))}
//       </div>
//       <ChatInput />
//     </div>
//   );
// };
