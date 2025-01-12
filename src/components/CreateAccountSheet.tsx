import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MD2DarkTheme, Provider } from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";

import moment from "moment";
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import { background, border, o75, text } from "../constants/colors";
import { ff_P_M, ff_P_R, ff_P_SM } from "../constants/fonts";
import { hp, wp } from "../helpers/utils";
import { CreatEventProps } from "../types/props";
import { showToast } from "./Toast";

const customDarkTheme: ThemeProp = {
  ...MD2DarkTheme,
  colors: {
    ...MD2DarkTheme.colors,
    primary: background.buttonLight,
  },
};
const CreateAccountSheet = ({ onCreate }: CreatEventProps) => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [isEndEnabled, setIsEndEnabled] = useState(false);
  const [eventStartDate, setEventDate] = useState("Date");
  const [eventStartTime, setEventStartTime] = useState("Time");
  const [eventEndTime, setEventEndTime] = useState("Time");
  const [isStartDateVisisble, setIsStartDateVisisble] = useState(false);
  const [isEndTimeVisisble, setIsEndTimeVisisble] = useState(false);
  const [isStartTimeVisisble, setIsStartTimevisible] = useState(false);

  useEffect(() => {
    if (
      eventStartDate !== "Pick Date" &&
      moment(eventStartDate, "YYYY-MM-DD").isValid() &&
      moment(eventStartTime, "hh:mm A").isValid()
    ) {
      setIsEndEnabled(true);
    }
  }, [eventStartDate, eventStartTime]);

  return (
    <Provider theme={customDarkTheme}>
      <BottomSheetView style = {{ height: hp(400)}}>
        <BottomSheetScrollView
          keyboardDismissMode={"interactive"}
          contentContainerStyle={sheetStyles.container}
        >
          <BottomSheetTextInput
            value={eventTitle}
            onChangeText={setEventTitle}
            placeholder="Title"
            placeholderTextColor={text.placeholder}
            style={sheetStyles.textInput}
          />
          <BottomSheetTextInput
            value={eventDescription}
            onChangeText={setEventDescription}
            placeholder="Description"
            placeholderTextColor={text.placeholder}
            multiline
            style={[
              sheetStyles.textInput,
              {
                height: hp(100),
                textAlignVertical: "top",
                paddingTop: hp(8),
              },
            ]}
          />
          <Text style={sheetStyles.dateTitle}>Start:</Text>
          <View style={sheetStyles.dateContainer}>
            <Pressable
              onPress={() => setIsStartDateVisisble(true)}
              style={sheetStyles.dateWrapper}
            >
              <MaterialCommunityIcons
                name="calendar-month"
                size={wp(24)}
                color={text.placeholder}
              />
              <Text style={sheetStyles.date}>{eventStartDate}</Text>

              <>
                {/* <RNDateTimePicker
                onChange={(e) => {
                  setIsStartDateVisisble(false);
                  if (e.type == "set") {
                    setEventDate(
                      moment(e.nativeEvent.timestamp).format("YYYY/MM/DD")
                    );
                    setEventEndTime("Time");
                  }
                }}
                value={new Date()}
              /> */}
                <DatePickerModal
                  locale="en"
                  mode="single"
                  presentationStyle="pageSheet"
                  visible={isStartDateVisisble}
                  onDismiss={() => {
                    setIsStartDateVisisble(false);
                  }}
                  onConfirm={({ date }) => {
                    setIsStartDateVisisble(false);
                    if (date) setEventDate(moment(date).format("YYYY/MM/DD"));
                    setEventEndTime("Time");
                  }}
                />
              </>
            </Pressable>
            <Pressable
              style={[sheetStyles.dateWrapper, { marginLeft: wp(10) }]}
              onPress={() => setIsStartTimevisible(true)}
            >
              <AntDesign
                name="clockcircleo"
                size={wp(20)}
                color={text.placeholder}
              />
              <Text style={sheetStyles.date}>{eventStartTime}</Text>
              {/* {isStartTimeVisisble && (
                <RNDateTimePicker
                  display="inline"
                  themeVariant="dark"
                  mode="time"
                  onChange={(e) => {
                    setIsStartTimevisible(false);
                    if (e.type == "set") {
                      setEventStartTime(
                        moment(e.nativeEvent.timestamp).format("hh:mm A")
                      );
                      setEventEndTime("Time");
                    }
                  }}
                  value={new Date()}
                />
              )} */}
              <TimePickerModal
                visible={isStartTimeVisisble}
                onDismiss={() => {
                  setIsStartTimevisible(false);
                }}
                onConfirm={({ hours, minutes }) => {
                  setIsStartTimevisible(false);
                  setEventStartTime(
                    moment(`${hours}:${minutes}`, "HH:mm").format("hh:mm A")
                  );
                  setEventEndTime("Time");
                }}
                hours={12}
                minutes={14}
              />
            </Pressable>
          </View>
          <>
            <Text style={sheetStyles.dateTitle}>End:</Text>
            <View style={sheetStyles.dateContainer}>
              <View style={sheetStyles.dateWrapper}>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={wp(24)}
                  color={text.placeholder}
                />
                <Text style={sheetStyles.date}>{eventStartDate}</Text>
              </View>
              <Pressable
                onPress={() => {
                  isEndEnabled && setIsEndTimeVisisble(true);
                }}
                style={[sheetStyles.dateWrapper, { marginLeft: wp(10) }]}
              >
                <AntDesign
                  name="clockcircleo"
                  size={wp(20)}
                  color={text.placeholder}
                />
                <Text style={sheetStyles.date}>{eventEndTime}</Text>
                {/* {isEndTimeVisisble && (
                  <RNDateTimePicker
                    display="inline"
                    themeVariant="dark"
                    mode="time"
                    minimumDate={moment(
                      `${eventStartDate} ${eventStartTime}`,
                      "YYYY/MM/DD hh:mm A"
                    ).toDate()}
                    onChange={(e) => {
                      setIsEndTimeVisisble(false);
                      if (e.type == "set")
                        setEventEndTime(() => {
                          const temp = moment(e.nativeEvent.timestamp).format(
                            "hh:mm A"
                          );
                          const startTime = moment(
                            `${eventStartDate} ${eventStartTime}`,
                            "YYYY/MM/DD hh:mm A"
                          );
                          const endTime = moment(
                            `${eventStartDate} ${temp}`,
                            "YYYY/MM/DD hh:mm A"
                          );
                          if (endTime.isBefore(startTime)) {
                            showToast(
                              "End time should be greater than start time"
                            );
                            return "Date";
                          }
                          return temp;
                        });
                    }}
                    value={moment(
                      `${eventStartDate} ${eventStartTime}`,
                      "YYYY/MM/DD hh:mm A"
                    )
                      .add(5, "minutes")
                      .toDate()}
                  />
                )} */}
                <TimePickerModal
                  visible={isEndTimeVisisble}
                  onDismiss={() => {
                    setIsEndTimeVisisble(false);
                  }}
                  onConfirm={({ hours, minutes }) => {
                    setIsEndTimeVisisble(false);
                    setEventEndTime(() => {
                      const temp = moment(
                        `${hours}:${minutes}`,
                        "HH:mm"
                      ).format("hh:mm A");
                      const startTime = moment(
                        `${eventStartDate} ${eventStartTime}`,
                        "YYYY/MM/DD hh:mm A"
                      );
                      const endTime = moment(
                        `${eventStartDate} ${temp}`,
                        "YYYY/MM/DD hh:mm A"
                      );
                      if (endTime.isBefore(startTime)) {
                        showToast("End time should be greater than start time");
                        return "Date";
                      }
                      return temp;
                    });
                  }}
                  hours={moment(`${eventStartTime}`, "hh:mm A").hour()}
                  minutes={moment(`${eventStartTime}`, "hh:mm A")
                    .add(5, "minutes")
                    .minute()}
                />
              </Pressable>
            </View>
          </>
          <TouchableOpacity
            onPress={() => {
              const start = moment(
                `${eventStartDate} ${eventStartTime}`,
                "YYYY/MM/DD hh:mm A"
              ).toDate();
              const end = moment(
                `${eventStartDate} ${eventEndTime}`,
                "YYYY/MM/DD hh:mm A"
              ).toDate();
              onCreate(eventTitle, eventDescription, start, end);
            }}
            style={sheetStyles.button}
          >
            <Text style={sheetStyles.buttonText}>Create</Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheetView>
    </Provider>
  );
};

export default CreateAccountSheet;

const sheetStyles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: wp(10),
  },
  textInput: {
    width: "100%",
    height: hp(35),
    backgroundColor: background.secondary,
    borderRadius: 8,
    marginTop: hp(10),
    paddingLeft: wp(16),
    fontSize: wp(14),
    ...ff_P_SM,
    color: text.placeholder,
  },
  dateContainer: {
    flexDirection: "row",
  },
  date: {
    paddingLeft: wp(8),
    fontSize: wp(13),
    ...ff_P_R,
    color: text.placeholder,
  },
  dateWrapper: {
    flexDirection: "row",
    height: hp(35),
    borderWidth: 1,
    borderColor: border,
    alignItems: "center",
    paddingLeft: wp(10),
    paddingRight: wp(20),
    borderRadius: wp(5),
    backgroundColor: background.secondary,
  },
  dateTitle: {
    fontSize: wp(15),
    ...ff_P_M,
    color: text.primaryDark,
    marginTop: hp(20),
  },
  button: {
    width: "50%",
    height: hp(35),
    backgroundColor: background.buttonLight + o75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(30),
    alignSelf: "center",
    marginTop: hp(25),
    marginBottom: hp(20),
  },
  buttonText: {
    color: text.buttonPrimary,
    fontSize: wp(14),
    ...ff_P_M,
  },
});
