import "./index.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";

import { ChatStoreProvider } from "./context/ChatStoreContext.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import { RoomStoreProvider } from "./context/RoomStoreContext.tsx";
import { StreamProvider } from "./context/StreamV2Context.tsx";
import { CreateRoom } from "./pages/CreateRoom.tsx";
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { Room } from "./pages/Room.tsx";
import { queryClient } from "./services/queryClient.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider viewportClassName="absolute bottom-0 right-0 list-none z-[1000]">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="createRoom" element={<CreateRoom />}></Route>
            <Route
              path="/room/:id"
              element={
                <RoomStoreProvider>
                  <ChatStoreProvider>
                    <StreamProvider>
                      <Room />
                    </StreamProvider>
                  </ChatStoreProvider>
                </RoomStoreProvider>
              }
            />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>,
);
