import { z } from "zod";

export const EventMainz = z.object({
  id: z.string(),
  start: z.string(),
  end: z.string(),
  title: z.string(),
  summary: z.string(),
  groupId: z.string(),
  color: z.string(),
});
export const ItemDataz = z.object({
  hour: z.string(),
  duration: z.string(),
  title: z.string(),
  id: z.string(),
  summary: z.string(),
  groupName: z.string()
});
export const AgendsItemz = z.object({
  title: z.string(),
  data: z.array(ItemDataz),
});
export const chatz = z.object({
  id: z.string(),
  senderName: z.string(),
  chat: z.string(),
  senderId: z.string(),
  timeStamp: z.string(),
});
const additionalz = z.object({
  bucket: z.array(
    z.object({
      buffer: z.string(),
      type: z.string(),
    })
  ),
  chats: z.array(chatz),
  checklist: z.array(
    z.object({
      id: z.string(),
      checkPoint: z.string(),
      isChecked: z.boolean(),
    })
  ),
});
const combinedz = EventMainz.and(additionalz);

export type EventMain = z.infer<typeof EventMainz>;
export type Event = z.infer<typeof combinedz>;
export type AgendaItem = z.infer<typeof AgendsItemz>;
export type ItemData = z.infer<typeof ItemDataz>;
export type Chat = z.infer<typeof chatz>
