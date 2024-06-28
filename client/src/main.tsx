import "./index.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";

import { ChatStoreProvider } from "./context/ChatStoreContext.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import { RoomV2Provider } from "./context/RoomV2Context.tsx";
import { StreamProvider } from "./context/StreamV2Context.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { UserV2Provider } from "./context/UserV2Context.tsx";
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
          <ThemeProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                path="/"
                element={
                  <UserV2Provider>
                    <Home />
                  </UserV2Provider>
                }
              />
              <Route
                path="createRoom"
                element={
                  <UserV2Provider>
                    <CreateRoom />
                  </UserV2Provider>
                }
              ></Route>
              <Route
                path="/room/:id"
                element={
                  <UserV2Provider>
                    <RoomV2Provider>
                      <ChatStoreProvider>
                        <StreamProvider>
                          <Room />
                        </StreamProvider>
                      </ChatStoreProvider>
                    </RoomV2Provider>
                  </UserV2Provider>
                }
              />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>,
);
