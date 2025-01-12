import { useDrawerStatus } from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/native";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { isEmpty } from "lodash";
import { showToast } from "../../components/Toast";
import { DateContext } from "../../context/Date";
import { GroupContext } from "../../context/Group";
import { ListenerContext } from "../../context/Listener";
import {
  createEvent as create,
  deleteEvent as deleteE,
  fetchEvents as fetch,
} from "../../services/apiHandler";
import { AgendaItem } from "../../types/event";
import { AgendaRouteProps } from "../../types/props";
import { ScreenType } from "../../types/utils";

export const useList = () => {
  const { date, setDate } = useContext(DateContext);
  const { selectedGroup } = useContext(GroupContext);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState<AgendaItem[]>([]);
  const [buttonFlag, setButtonFlag] = useState<boolean>(false);
  const [isInfoVisisble, setIsInfoVisisble] = useState<boolean>(false);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
  const {
    groupIds,
    deleteGroupId,
    eventIds,
    deleteEventId,
    actions,
    deleteAction,
  } = useContext(ListenerContext);
  const isDrawerOpen = useDrawerStatus();
  const { params } = useRoute<AgendaRouteProps>();
  const [isCreateEvent, setIsCreateEvent] = useState<boolean>(false);
  const [isDeleteEvent, setIsDeleteEvent] = useState<boolean>(false);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(false);
  const snapPoints = useMemo(() => ["65%"], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const calendarRef = useRef<BottomSheetModal>(null);
  const items: any = useMemo(() => {
    return events.map((e) => {
      if (isEmpty(e.data)) {
        return {
          ...e,
          data: [{}],
        };
      }
      return e;
    });
  }, [events]);

  useEffect(() => {
    setSelectedEvent("");
    setButtonFlag(false);
    if (selectedGroup) setEvents([]);
    if (selectedGroup == "0") showToast("Personal will be implemented later");
    else {
      fetchEvents(selectedGroup?.id);
      if (groupIds.has(selectedGroup?.id ?? ""))
        deleteGroupId && deleteGroupId(selectedGroup?.id ?? "");
    }
  }, [selectedGroup]);
  useEffect(() => {
    if (selectedGroup == "0") showToast("Personal will be implemented later");
    else {
      fetchEvents(selectedGroup?.id);
    }
  }, [date]);
  useEffect(() => {
    params.isDrawerOpened(isDrawerOpen == "open");
  }, [isDrawerOpen]);
  useEffect(() => {
    if (selectedGroup != "0") fetchEvents(selectedGroup?.id);
  }, [eventIds]);
  const fetchEvents = async (id: string | undefined) => {
    setIsEventsLoading(true);
    try {
      const res = (await fetch(ScreenType.Agenda, date, id)) as AgendaItem[];
      setEvents(res);
    } catch (error: any) {
      if (error.response) showToast(error.response.data.message);
      else showToast("Unexpected error");
    }
    setIsEventsLoading(false);
  };

  const createEvent = async (
    id: string,
    title: string,
    description: string,
    start: Date,
    end: Date
  ) => {
    setIsCreateEvent(true);
    try {
      const result = new Date(date);
      result.setDate(result.getDate() + 1);
      const res = (await create(
        id,
        description,
        start,
        end,
        title,
        ScreenType.Agenda
      )) as AgendaItem[];
      setEvents(res);
      showToast("Event created successfully");
      params.onEventCreate();
    } catch (error: any) {
      if (error.response) showToast(error.response.data.message);
      else showToast("Unexpected error");
    }
    setIsCreateEvent(false);
  };

  const onCardTap = (id: string) => {
    if (!buttonFlag) setButtonFlag(true);
    deleteEventId && deleteEventId(id);
    setSelectedEvent(id);
  };

  const deleteEvent = async () => {
    setIsDeleteEvent(true);
    try {
      const res = await deleteE(
        selectedEvent,
        new Date(date),
        selectedGroup != "0" ? selectedGroup?.id : undefined
      );
      setEvents(res);
      showToast("deleted successfully");
      setSelectedEvent("");
      setButtonFlag(false);
      params.onEventDeleted();
    } catch (error: any) {
      if (error.response) showToast(error.response.data.message);
      else showToast("Unexpected error");
    }
    setIsDeleteEvent(false);
  };

  return {
    createEvent,
    selectedGroup,
    events,
    selectedEvent,
    setSelectedEvent,
    buttonFlag,
    onCardTap,
    isInfoVisisble,
    setIsInfoVisisble,
    setButtonFlag,
    eventIds,
    deleteEvent,
    isCreateEvent,
    isDeleteEvent,
    isEventsLoading,
    actions,
    isChatVisible,
    setIsChatVisible,
    deleteAction,
    date,
    setDate,
    fetchEvents,
    snapPoints,
    bottomSheetRef,
    items,
    calendarRef,
  };
};
