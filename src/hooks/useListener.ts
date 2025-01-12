import auth from "@react-native-firebase/auth";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import { SOCKET_URL } from "@env";
import { ListenerAction } from "../types/utils";
import { Chat } from "../types/event";

export const useListener = () => {
  const socket = useRef<Socket>();
  const user = auth().currentUser;
  const [groupIds, setGroupIds] = useState<Set<string>>(new Set([]));
  const [eventIds, setEventIds] = useState<Set<string>>(new Set([]));
  const [actions, setActions] = useState<{
    [key: string]: Set<ListenerAction>;
  }>({});
  let broadcast = useRef<((eventId: string, chat: Chat) => void) | undefined>(undefined)
  const register = (
    action: ((eventId: string, chat: Chat) => void) | undefined
  ) => {
    broadcast.current = action;
  };

  const updateGroupIds = (val: string) => {
    setGroupIds((pre) => new Set([val, ...pre]));
  };
  const updateEventIds = (val: string) => {
    setEventIds((pre) => new Set([val, ...pre]));
  };
  const updateActions = (action: ListenerAction, id: string) => {
    setActions((pre) => {
      pre[id] = (pre[id] || new Set()).add(action);
      return { ...pre };
    });
  };
  const deleteGroupId = (val: string) => {
    setGroupIds((pre) => {
      pre?.delete(val);
      return new Set([...pre]);
    });
  };
  const deleteEventId = (val: string) => {
    setEventIds((pre) => {
      pre?.delete(val);
      return new Set([...pre]);
    });
  };
  const deleteAction = (action: ListenerAction, id: string) => {
    setActions((pre) => {
      pre[id]?.delete(action);
      pre[id]?.size == 0 && delete pre[id];
      return {
        ...pre,
      };
    });
  };

  const init = async () => {
    const token = (await user?.getIdToken()) ?? "";
    socket.current = io(`${SOCKET_URL}`, {
      extraHeaders: {
        authorization: token,
      },
    });
    socket.current?.on("connect", () => {
      console.log("Connected to the server.");
    });
    socket.current?.on("chat", ({eventId, chat}) => {
      broadcast.current && broadcast.current(eventId, chat)
    });
    socket.current?.on(
      "message",
      ({ groupId = "", eventIds = [], action = ListenerAction.NoAction }) => {
        setGroupIds((pre) => new Set([groupId, ...pre]));
        setEventIds((pre) => new Set([...eventIds, ...pre]));
        setActions((pre) => {
          const temp: { [key: string]: Set<ListenerAction> } = {};
          eventIds.forEach((element: string) => {
            temp[element] = new Set([action, ...(pre[element] ?? [])]);
          });

          return {
            ...pre,
            ...temp,
          };
        });
      }
    );
    socket.current?.on("disconnect", () => {
      console.log("Disconnected from the server.");
    });

    socket.current?.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });
  };
  useEffect(() => {
    init();

    return () => {
      socket.current?.disconnect();
      console.log("Socket disconnected.");
    };
  }, []);

  return {
    groupIds,
    eventIds,
    actions,
    updateActions,
    updateEventIds,
    updateGroupIds,
    deleteAction,
    deleteEventId,
    deleteGroupId,
    register,
  };
};
