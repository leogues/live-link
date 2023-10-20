import Peer from "peerjs";
import { createContext, useContext, useEffect, useState } from "react";
import { UserV2Context } from "./UserV2Context";
import { ws } from "../services/ws";
import { addPeerStreamAction } from "../reducers/peersActions";
import { RoomV2Context } from "./RoomV2Context";
import { IPeer } from "../types/peer";

interface StreamValue {
  stream?: MediaStream;
}

interface getMediaProps {
  type: "user-media" | "display-media";
  audio?: boolean;
  video?: boolean;
}

interface StreamContextProps {
  children: React.ReactNode;
}

export const StreamContext = createContext<StreamValue>({
  stream: new MediaStream(),
});

export const StreamProvider: React.FunctionComponent<StreamContextProps> = ({
  children,
}) => {
  const { user } = useContext(UserV2Context);
  const { peers, addPeer, dispatchPeers } = useContext(RoomV2Context);
  const [stream, setStream] = useState<MediaStream>();
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isWebcamOn, setIsWebCamOn] = useState<boolean>(true);
  const [isStreamScreen, setIsStreamScreen] = useState<boolean>(false);
  const [me, setMe] = useState<Peer>();

  const setMedia = async ({ type, audio, video }: getMediaProps) => {
    const acceptedMedia = {
      "user-media": (audio: boolean = true, video: boolean = false) => {
        try {
          return navigator.mediaDevices.getUserMedia({
            audio,
            video,
          });
        } catch (error) {
          console.error(error);
        }
      },
      "display-media": (audio: boolean = false) => {
        return navigator.mediaDevices.getDisplayMedia({ audio });
      },
    };

    const functionMedia = acceptedMedia[type];

    if (!functionMedia) return;

    const media = await functionMedia(audio, video);

    if (!media) return;
    setStream(media);
  };

  useEffect(() => {
    if (!user) return;

    const peer = new Peer(user.id, {
      host: "localhost",
      port: 9001,
      path: "/myapp",
      debug: 1,
    });

    setMe(peer);
    setMedia({ type: "user-media", audio: isMuted, video: isWebcamOn });
    return () => {
      me?.disconnect();
      console.log("Desmontou");
    };
  }, [user]);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;

    ws.on("user-joined", (peer: IPeer) => {
      addPeer(peer);
      const call = me.call(peer.user.id, stream, {
        metadata: { userName: peer.user.name },
      });

      console.log(call);

      call.on("stream", (peerStream) => {
        dispatchPeers(addPeerStreamAction(peer.user.id, peerStream));
      });
    });

    me.on("call", (call) => {
      const { userName } = call.metadata;

      console.log(userName);

      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatchPeers(addPeerStreamAction(call.peer, peerStream));
      });
    });

    return () => {
      ws.off("user-joined");
    };
  }, [me, stream]);

  console.log(stream);

  return (
    <StreamContext.Provider value={{ stream }}>
      {children}
    </StreamContext.Provider>
  );
};
