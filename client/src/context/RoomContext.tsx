import {
  createContext,
  useEffect,
  useState,
  useReducer,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { Peer, MediaConnection } from "peerjs";
import { ws } from "../services/ws";
import { peersReducer, PeerState } from "../reducers/peerReducer";
import {
  addPeerStreamAction,
  addPeerNameAction,
  removePeerStreamAction,
  addAllPeersAction,
} from "../reducers/peerActions";

import { UserContext } from "./UserContext";
import { IPeer } from "../types/peer";

interface RoomValue {
  stream?: MediaStream;
  peers: PeerState;
  shareScreen: () => void;
  roomId: string;
  setRoomId: (id: string) => void;
  screenSharingId: string;
}

interface RoomContextProps {
  children: React.ReactNode;
}

export const RoomContext = createContext<RoomValue>({
  peers: {},
  shareScreen: () => {},
  setRoomId: (_id) => {},
  screenSharingId: "",
  roomId: "",
});

export const RoomProvider: React.FunctionComponent<RoomContextProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { userName, userId } = useContext(UserContext);
  const [me, setMe] = useState<Peer>();
  const [mediaConnections, setMediaConnections] = useState<MediaConnection[]>(
    [],
  );
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [screenSharingId, setScreenSharingId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const enterRoom = ({ roomId }: { roomId: "string" }) => {
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({
    participants,
  }: {
    participants: Record<string, IPeer>;
  }) => {
    dispatch(addAllPeersAction(participants));
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerStreamAction(peerId));

    const updatedMediaConnections = mediaConnections.filter(
      (mediaConnection) => mediaConnection.peer !== peerId,
    );

    setMediaConnections(updatedMediaConnections);
  };

  const switchStream = (stream: MediaStream) => {
    setStream(stream);
    setScreenSharingId(me?.id || "");

    mediaConnections.forEach((mediaConnection) => {
      mediaConnection;
      const videoTrack = stream
        ?.getTracks()
        .find((track) => track.kind === "video");

      if (!videoTrack) return;

      mediaConnection.peerConnection
        .getSenders()[1]
        .replaceTrack(videoTrack)
        .catch((err) => console.error(err));
    });
  };

  const shareScreen = async () => {
    try {
      const stream = await (screenSharingId
        ? navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        : navigator.mediaDevices.getDisplayMedia({}));

      switchStream(stream);
    } catch (error) {
      console.error(error);
    }
  };
  const nameChangedHandler = ({
    peerId,
    userName,
  }: {
    peerId: string;
    userName: string;
  }) => {
    dispatch(addPeerNameAction(peerId, userName));
  };

  useEffect(() => {
    ws.emit("change-name", { peerId: userId, userName, roomId });
  }, [userName, userId, roomId]);

  useEffect(() => {
    const peer = new Peer(userId, {
      host: "localhost",
      port: 9001,
      path: "/myapp",
    });

    setMe(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }

    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
    ws.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
    ws.on("user-stopped-sharing", () => {
      console.log("stop");
      setScreenSharingId("");
    });
    ws.on("name-changed", nameChangedHandler);

    return () => {
      ws.off("room-created");
      ws.off("get-users");
      ws.off("user-disconnected");
      ws.off("user-started-sharing");
      ws.off("user-stopped-sharing");
      ws.off("user-joined");
      ws.off("name-changed");
      me?.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(screenSharingId);
    if (screenSharingId) {
      ws.emit("start-sharing", { peerId: screenSharingId, roomId });
    } else {
      ws.emit("stop-sharing", roomId);
    }
  }, [screenSharingId, roomId]);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;

    ws.on("user-joined", ({ peerId, userName: name }) => {
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
        },
      });

      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(peerId, peerStream));
      });
      dispatch(addPeerNameAction(peerId, name));
    });

    me.on("call", (call) => {
      const { userName } = call.metadata;
      dispatch(addPeerNameAction(call.peer, userName));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });
    });

    return () => {
      ws.off("user-joined");
    };
  }, [me, stream, userName]);

  return (
    <RoomContext.Provider
      value={{
        stream,
        peers,
        shareScreen,
        roomId,
        setRoomId,
        screenSharingId,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
