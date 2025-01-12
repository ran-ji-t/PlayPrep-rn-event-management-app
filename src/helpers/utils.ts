import { bh, bw, sh, sw } from "../constants/appConstants";
import { ListenerAction } from "../types/utils";

export const wp = (w: number): number => (w * sw) / bw;
export const hp = (h: number): number => (h * sh) / bh;
export const resolveListenerAction = (action: string): ListenerAction => {
  switch (action) {
    case ListenerAction.EventCreated:
      return ListenerAction.EventCreated;
    case ListenerAction.EventDeleted:
      return ListenerAction.EventDeleted;
    case ListenerAction.MediaReceived:
      return ListenerAction.MediaReceived;
    case ListenerAction.MessageReceived:
      return ListenerAction.MessageReceived;
    default:
      return ListenerAction.NoAction;
  }
};
