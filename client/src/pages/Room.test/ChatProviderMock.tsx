// import { ChatStoreContext, ChatStoreContextType } from "../../context/ChatStoreContext";

// export type IChatProviderProps = ChatStoreContextType;

// export type ChatCustomProviderProps = {
//   children: any;
//   providerProps?: IChatProviderProps | {};
// };

// export const chatCustomProviderProps = ({
//   children,
//   providerProps = {},
// }: ChatCustomProviderProps) => {
//   const defaultProps: IChatProviderProps = {
//     chat: {
//       isChatOpen: true,
//       messages: [],
//     },
//     menuRef: {
//       chatInput: { current: null },
//       chat: { current: null },
//       inviteModal: { current: null },
//     },
//     sendMessage: () => {},
//     toggleChat: () => {},
//   };

//   const props = { ...defaultProps, ...providerProps };

//   return <ChatStoreContext.Provider value={props}>{children}</ChatStoreContext.Provider>;
// };
