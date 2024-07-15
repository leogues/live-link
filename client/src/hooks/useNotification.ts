import { useContext } from "react";

import { NotificationDispatch } from "../context/NotificationContext";

export const useNotification = () => {
  const dispatch = useContext(NotificationDispatch);
  if (!dispatch) {
    throw new Error("Missing NotificationProvider");
  }
  return dispatch;
}