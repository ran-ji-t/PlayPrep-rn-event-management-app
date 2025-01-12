import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { Positions } from "react-native-calendars/src/expandableCalendar";
import { sw } from "../constants/appConstants";
import { background, o50, text } from "../constants/colors";
import { wp } from "../helpers/utils";
import { getMarks } from "../services/apiHandler";
import { CalendarComponentProps } from "../types/props";
import { Theme } from "react-native-calendars/src/types";

const Calendar = ({
  date,
  onClose,
  groupId,
  onDateTapped,
}: CalendarComponentProps) => {
  const [currentDate, setCurrentDate] = useState(date);
  const { data, error, isLoading } = useQuery({
    queryKey: [`marks/${currentDate}/${groupId}`],
    queryFn: () => getMarks(currentDate, groupId),
  });
  console.log(data);

  return (
    <CalendarProvider
      date={date}
      onMonthChange={(val) => {
        console.log(val);
        setCurrentDate(val.dateString);
      }}
      style={{
        justifyContent: "center",
      }}
    >
      <Pressable style={styles.pressable} onPress={onClose} />
      <View style={styles.listWrapper}>
        <ExpandableCalendar
          displayLoadingIndicator = {isLoading}
          onDayPress={(day) => onDateTapped(day.dateString)}
          theme={calendarTheme}
          closeOnDayPress={false}
          enableSwipeMonths
          firstDay={1}
          style={styles.list}
          initialPosition={Positions.OPEN}
          calendarWidth={sw - wp(20)}
          markingType="dot"
          markedDates={data}
        />
      </View>
    </CalendarProvider>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  listWrapper: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: wp(10),
  },
  list: {
    borderRadius: wp(20),
  },
});

const calendarTheme = {
  calendarBackground: background.secondary,
  selectedDayBackgroundColor: background.buttonDark + o50,
  todayTextColor: text.link,
  textMonthFontFamily: "Poppins-Bold",
  textDayHeaderFontFamily: "Poppins-Medium",
  textDayHeaderFontSize: wp(12),
  textDayFontFamily: "Poppins-SemiBold",
  arrowColor: text.link,
  todayButtonFontSize: wp(15),
  textDisabledColor: text.placeholder + o50,
  textInactiveColor: text.placeholder + o50,
  dayTextColor: text.primaryDark,
  "stylesheet.calendar.header": {
    week: {
      marginTop: 0,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  },
  dotColor: text.google,
};
