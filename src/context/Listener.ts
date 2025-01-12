import { createContext } from "react";
import { ListenerAction } from "../types/utils";
import { Chat } from "../types/event";

type COntextType = {
  groupIds: Set<string>;
  eventIds: Set<string>;
  actions?: {[key: string]: Set<ListenerAction>};
  updateGroupIds?: (val: string) => void;
  updateEventIds?: (val: string) => void;
  updateActions?: (action: ListenerAction, id: string) => void;
  deleteGroupId?:(val: string) => void;
  deleteEventId?:(val: string) => void;
  deleteAction?:(action: ListenerAction, id: string) => void;
  register?:(action: ((eventId: string, chat: Chat) => void)|undefined) => void
};
export const ListenerContext = createContext<COntextType>({
  eventIds: new Set([]),
  groupIds: new Set([]),
});
