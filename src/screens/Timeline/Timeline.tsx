import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import {
  CalendarProvider,
  ExpandableCalendar,
  TimelineList,
} from "react-native-calendars";

import moment from "moment";
import { background, text } from "../../constants/colors";
import { ff_P_M, ff_P_R } from "../../constants/fonts";
import { hp, wp } from "../../helpers/utils";
import { useCalendar } from "./useCalendar";
import EventCard from "../../components/EventCard";
import { number } from "zod";

const Calendar = () => {
  const {
    initialDate,
    onMonthChange,
    onDayPress,
    selectedGroup,
    createEvent,
    events,
    selectedEvent,
    setSelectedEvent,
  } = useCalendar();
  const [state, setState] = useState("");
  return (
    <CalendarProvider
      showTodayButton
      theme={calendarProviderTheme}
      todayBottomMargin={hp(50)}
      todayButtonStyle={{
        bottom: 0,
      }}
      onMonthChange={onMonthChange}
      date={initialDate}
    >
      <ExpandableCalendar
        theme={expandableCalendarTheme}
        pastScrollRange={5}
        futureScrollRange={5}
        firstDay={1}
        closeOnDayPress={false}
        onDayPress={onDayPress}
      />
      <TimelineList
        scrollToNow
        key={"Timelinekey"}
        showNowIndicator
        events={events}
        timelineProps={{
          renderEvent(event) {
            return (
              <EventCard
                event={event}
                id={state}
                onPress={setState}
              />
            );
          },
        }}
      />
      {selectedGroup && selectedGroup != "0" && (
        <TouchableOpacity
          onPress={() => createEvent(selectedGroup.id)}
          style={styles.floatingButton}
        >
          <Text style={styles.floatingButtonText}>+ Event</Text>
        </TouchableOpacity>
      )}
    </CalendarProvider>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background.primary,
  },
  floatingButton: {
    position: "absolute",
    bottom: hp(50),
    right: wp(15),
    elevation: 10,
    height: hp(24),
    backgroundColor: background.primary,
    width: wp(80),
    borderRadius: wp(20),
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtonText: {
    fontSize: wp(15),
    color: text.link,
    ...ff_P_M,
  },
});

const calendarProviderTheme = {
  todayButtonFontFamily: "Poppins-Medium",
  todayButtonTextColor: text.link,
};
const expandableCalendarTheme = {
  calendarBackground: background.secondary,
  selectedDayBackgroundColor: background.primaryDark,
  todayTextColor: text.link,
  textMonthFontFamily: "Poppins-Bold",
  textDayHeaderFontFamily: "Poppins-Medium",
  textDayHeaderFontSize: wp(12),
  textDayFontFamily: "Poppins-SemiBold",
  arrowColor: text.link,
  todayButtonFontSize: wp(15),
};
