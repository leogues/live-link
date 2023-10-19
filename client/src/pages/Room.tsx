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
import { ChatButton } from "../components/ChatButton";

import { ws } from "../services/ws";
import { ChatContext } from "../context/ChatContext";
import { UserV2Context } from "../context/UserV2Context";
import { RoomV2Context } from "../context/RoomV2Context";
import { formatDate } from "../Utils/DateUtils";

import videoCamIcon from "../assets/videoCam.png";
import { Profile } from "../components/Profile";

export const Room = () => {
  const { room } = useContext(RoomV2Context);
  const { user } = useContext(UserV2Context);
  const { toggleChat } = useContext(ChatContext);

  const createAtFormated = room?.createdAt ? formatDate(room?.createdAt) : "";

  useEffect(() => {
    console.log("test");
    ws.emit("join-room", {
      roomId: room?.id,
      peerId: user?.id,
      userName: user?.name,
    });
  }, [room?.id, user?.id, user?.name]);

  return (
    <div className="flex min-h-screen flex-col font-medium ">
      <div className="flex items-center text-white dark:bg-darkBlue-900">
        <div className="min-w-max border-r border-opacity-60 p-4 px-8 dark:border-[#23212194]">
          <img className="block h-16 w-16" src={videoCamIcon} />
        </div>
        <div className="ml-10 flex flex-col">
          <span className="text-2xl text-[#E2E2E2]">{room?.topic}</span>
          <span className="text-[#9F9F9F]">{createAtFormated}</span>
        </div>
        <div className="ml-auto flex basis-[32rem] items-center px-7">
          <div>...............</div>
          <div className="ml-14 grow">
            {user && (
              <Profile
                name={user.name}
                lastName={user.lastName}
                picture={user.picture}
                role={user.id === room?.userId ? "Moderador" : "Participante"}
                fontSize="sm"
                imageSize="sm"
                marginRight="4"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex grow"></div>

      <div className="fixed bottom-0 flex h-28 w-full items-center justify-center gap-2 border-t-2 p-6 dark:border-0 dark:bg-darkBlue-900">
        <ChatButton onClick={toggleChat} />
      </div>
    </div>
  );
};
