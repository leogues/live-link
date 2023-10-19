// import { useContext, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { RoomContext } from "../context/RoomContext";
// import { VideoPlayer } from "../components/VideoPlayer";
// import { PeerState } from "../reducers/peerReducer";
// import { ShareScreenButton } from "../components/ShareScreenButton";
// import { ChatButton } from "../components/ChatButton";
// import { Chat } from "../components/chat/Chat";
// import { NameInput } from "../components/common/Name";
// import { ws } from "../ws";

// export const Room = () => {
//   const { id } = useParams();
//   const {
//     me,
//     userName,
//     stream,
//     peers,
//     shareScreen,
//     screenSharingId,
//     setRoomId,
//     toggleChat,
//     chat,
//   } = useContext(RoomContext);

//   useEffect(() => {
//     if (me && stream)
//       ws.emit("join-room", { roomId: id, peerId: me._id, userName });
//   }, [id, me, ws, stream]);

//   useEffect(() => {
//     setRoomId(id);
//   }, [id, setRoomId]);

//   console.log({ screenSharingId });

//   const screenSharingVideo =
//     screenSharingId == me?.id ? stream : peers[screenSharingId]?.stream;

//   const { [screenSharingId]: sharing, ...peersToShow } = peers;

//   return (
//     <div className="flex min-h-screen flex-col">
//       <div className="bg-violet-600 p-4 text-lg font-bold text-white">
//         Room id: {id}
//       </div>
//       <div className="flex grow">
//         {screenSharingVideo && (
//           <div className="w-4/5 pr-4">
//             <VideoPlayer stream={screenSharingVideo} />
//           </div>
//         )}
//         <div
//           className={`grid gap-4 ${
//             screenSharingVideo ? "grid-col-1 w-1/5 pr-4" : "grid-cols-4"
//           }`}
//         >
//           {screenSharingId !== me?.id && (
//             <div>
//               <VideoPlayer stream={stream} />
//               <NameInput />
//             </div>
//           )}

//           {Object.values(peersToShow as PeerState)
//             .filter((peer) => !!peer.stream)
//             .map((peer, index) => {
//               return (
//                 <div key={index}>
//                   {peer.stream && <VideoPlayer stream={peer.stream} />}
//                   <div>{peer.userName}</div>
//                 </div>
//               );
//             })}
//         </div>
//         {chat.isChatOpen && (
//           <div className="border-l-2 pb-28">
//             <Chat />
//           </div>
//         )}
//       </div>
//       <div className="fixed bottom-0 flex h-28 w-full items-center justify-center gap-2 border-t-2 bg-white p-6">
//         <ShareScreenButton onClick={shareScreen} />
//         <ChatButton onClick={toggleChat} />
//       </div>
//     </div>
//   );
// };

import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShareScreenButton } from "../components/ShareScreenButton";
import { ChatButton } from "../components/ChatButton";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import { RoomContext } from "../context/RoomContext";
import { Chat } from "../components/chat/Chat";
//import { NameInput } from "../components/common/Name";
import { ws } from "../services/ws";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { UserV2Context } from "../context/UserV2Context";

export const Room = () => {
  const { id } = useParams();
  const { stream, peers, shareScreen, screenSharingId, setRoomId } =
    useContext(RoomContext);
  const { userName, userId } = useContext(UserContext);
  const { toggleChat, chat } = useContext(ChatContext);
  const { user } = useContext(UserV2Context);

  useEffect(() => {
    if (stream) ws.emit("join-room", { roomId: id, peerId: userId, userName });
  }, [id, userId, stream, userName]);

  useEffect(() => {
    setRoomId(id || "");
  }, [id, setRoomId]);

  const screenSharingVideo =
    screenSharingId === userId ? stream : peers[screenSharingId]?.stream;

  const { [screenSharingId]: sharing, ...peersToShow } = peers;
  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-4 text-white dark:bg-darkBlue-900">Room id {id}</div>
      <div className="flex grow">
        {screenSharingVideo && (
          <div className="w-4/5 pr-4">
            <VideoPlayer stream={screenSharingVideo} />
          </div>
        )}
        <div
          className={`grid gap-4 ${
            screenSharingVideo ? "grid-col-1 w-1/5" : "grid-cols-4"
          }`}
        >
          {screenSharingId !== userId && (
            <div>
              {stream && <VideoPlayer stream={stream} />}
              <span className="dark:text-white">{user?.name}</span>
            </div>
          )}

          {Object.values(peersToShow as PeerState)
            .filter((peer) => !!peer.stream)
            .map((peer) => (
              <div key={peer.peerId}>
                {peer.stream && <VideoPlayer stream={peer.stream} />}
                <div>{peer.userName}</div>
              </div>
            ))}
        </div>
        {chat.isChatOpen && (
          <div className="border-l-2 pb-28">
            <Chat />
          </div>
        )}
      </div>
      <div className="fixed bottom-0 flex h-28 w-full items-center justify-center gap-2 border-t-2 p-6 dark:border-0 dark:bg-darkBlue-900">
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
      </div>
    </div>
  );
};
