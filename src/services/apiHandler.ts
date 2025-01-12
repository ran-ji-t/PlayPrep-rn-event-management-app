import { API_BASE_URL } from "@env";
import axios, { CancelTokenSource } from "axios";
import auth from "@react-native-firebase/auth";
import * as z from "zod";

import { Group, Groupz } from "../types/group";
import {
  AgendaItem,
  AgendsItemz,
  Chat,
  chatz,
  EventMain,
  EventMainz,
} from "../types/event";
import { ScreenType } from "../types/utils";

var source!: CancelTokenSource;
const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export const fetchAllGroup = async (): Promise<
  Pick<Group, "id" | "name" | "count">[]
> => {
  const token = await auth().currentUser?.getIdToken();
  const res = await instance.get("/group/fetchAll", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status != 200) throw res.statusText;
  if (!res.data) throw new Error("No data");
  const validator = z.array(
    Groupz.pick({
      name: true,
      id: true,
      count: true,
    })
  );
  const { data, error } = validator.safeParse(res.data);
  if (error) throw error;
  return data;
};

export const joinGroup = async (
  groupId: string
): Promise<Pick<Group, "id" | "name" | "count">> => {
  try {
    const token = await auth().currentUser?.getIdToken();
    const res = await instance.post(
      "/group/join",
      {
        groupId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const validator = Groupz.pick({
      name: true,
      id: true,
      count: true,
    });
    const { data, error } = validator.safeParse(res.data);
    if (error) throw error;
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const createGroup = async (
  groupName: string,
  members: any[],
  description?: string
): Promise<Pick<Group, "id" | "name">> => {
  try {
    const token = await auth().currentUser?.getIdToken();
    const res = await instance.post(
      "/group/create",
      {
        groupName,
        members,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const validator = Groupz.pick({
      name: true,
      id: true,
    });
    const { data, error } = validator.safeParse(res.data);
    if (error) throw error;
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const fetchGroupInfo = async (groupId: string) => {
  const token = await auth().currentUser?.getIdToken();
  const res = await instance.post(
    "/group/detail",
    { groupId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (res.data) res.data.count = 0;
  const { data, error } = Groupz.safeParse(res.data);
  if (error) throw error;
  return data;
};

export const fetchEvents = async (
  param: ScreenType,
  date: string,
  groupId?: string
): Promise<EventMain[] | AgendaItem[]> => {
  try {
    if (source) {
      source.cancel();
    }
    const cancelToken = axios.CancelToken;
    source = cancelToken.source();
    const token = await auth().currentUser?.getIdToken();
    const res = await instance.post(
      `/event/fetchAll?type=${param}`,
      {
        groupId,
        date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: source.token,
      }
    );
    const { data = [], error } =
      param == ScreenType.Agenda
        ? z.array(AgendsItemz).safeParse(res.data)
        : z.array(EventMainz).safeParse(res.data);
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const createEvent = async (
  groupId: string,
  description: string,
  end: Date,
  start: Date,
  title: string,
  param: ScreenType
): Promise<EventMain[] | AgendaItem[]> => {
  try {
    const token = await auth().currentUser?.getIdToken();
    const res = await instance.post(
      `/event/create?type=${param}`,
      {
        groupId,
        description,
        end,
        start,
        title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { data = [], error } =
      param == ScreenType.Agenda
        ? z.array(AgendsItemz).safeParse(res.data)
        : z.array(EventMainz).safeParse(res.data);
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteEvent = async (
  eventId: string,
  start: Date,
  groupId?: string
): Promise<AgendaItem[]> => {
  try {
    const token = await auth().currentUser?.getIdToken();
    const res = await instance.delete(
      `/event/delete?eventId=${eventId}&start=${start}${groupId ? "&group=" + groupId : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { data = [], error } = z.array(AgendsItemz).safeParse(res.data);
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const postChat = async (eventId: string, message: string) => {
  const token = await auth().currentUser?.getIdToken();
  await instance.post(
    `/event/chat/post`,
    {
      eventId,
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getChats = async (
  eventId: string,
  chatId: string,
  limit: number = 10
): Promise<Chat[]> => {
  const token = await auth().currentUser?.getIdToken();
  const res = await instance.get(
    `/event/chat/getAll?eventId=${eventId}&chatId=${chatId}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { data = [], error } = z.array(chatz).safeParse(res.data);
  if (error) throw error;
  return data;
};

export const getMarks = async (month: string, groupId?: string) => {
  const token = await auth().currentUser?.getIdToken();
  const res = await instance.get(
    `/event/marks?month=${month}${groupId ? "&groupId=" + groupId : ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data
};
