import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  CalendarUtils,
  DateData,
  TimelineEventProps,
} from "react-native-calendars";

import { showToast } from "../../components/Toast";
import { GroupContext } from "../../context/Group";
import {
  fetchEvents as fetch,
  createEvent as create,
} from "../../services/apiHandler";
import { groupBy } from "lodash";
import { EventMain } from "../../types/event";
import { ScreenType } from "../../types/utils";

export const useCalendar = () => {
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const initialDate = useMemo(() => new Date().toString(), []);
  const { selectedGroup } = useContext(GroupContext);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState<{
    [date: string]: TimelineEventProps[];
  }>({
    "": [],
  });

  useEffect(() => {
    if (!selectedGroup)
      setEvents({
        "": [],
      });
    if (selectedGroup == "0") showToast("Personal will be implemented later");
    else fetchEvents(selectedGroup?.id);
  }, [selectedGroup, date]);
  const fetchEvents = async (id: string | undefined) => {
    try {
      const res = (await fetch(ScreenType.Timeline, date, id)) as EventMain[];
      const groupedEvenets = groupBy(res, (e) =>
        CalendarUtils.getCalendarDateString(e.start)
      );
      setEvents(groupedEvenets);
    } catch (error: any) {
      if (error.response) showToast(error.response.data.message);
      else showToast("Unexpected error");
    }
  };
  const createEvent = async (id: string) => {
    try {
      const result = new Date(date);
      result.setDate(result.getDate() + 1);
      const res = (await create(
        id,
        "This is a test event in test group",
        result,
        new Date(),
        "Test Event",
        ScreenType.Timeline,
      )) as EventMain[];
      const groupedEvenets = groupBy(res, (e) =>
        CalendarUtils.getCalendarDateString(e.start)
      );
      setEvents((pre) => {
        for (const key in groupedEvenets) {
          pre[key] = [...groupedEvenets[key], ...(pre[key] || [])];
        }
        return pre;
      });
      showToast("Event created successfully");
    } catch (error: any) {
      if (error.response) showToast(error.response.data.message);
      else showToast("Unexpected error");
    }
  };
  const onMonthChange = (data: DateData) => {
    setDate(data.dateString);
  };
  const onDayPress = (data: DateData) => {};

  return {
    initialDate,
    onMonthChange,
    onDayPress,
    createEvent,
    selectedGroup,
    events,
    selectedEvent,
    setSelectedEvent,
  };
};
