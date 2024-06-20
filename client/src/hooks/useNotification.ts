import { useContext } from "react";

import { NotificationDispatch } from "../context/NotificationContext";

export const useNotification = () => useContext(NotificationDispatch);
