import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CalendarProvider, AgendaList as List } from "react-native-calendars";
import Animated, { Easing, SlideOutDown } from "react-native-reanimated";

import Calendar from "../../components/Calendar";
import ChatContainer from "../../components/ChatContainer";
import CreateAccountSheet from "../../components/CreateAccountSheet";
import GroupInfoContainer from "../../components/GroupInfoContainer";
import Icon from "../../components/Icon";
import SyncButton from "../../components/SyncButton";
import { background, o50, o75, text } from "../../constants/colors";
import { ff_P_B, ff_P_M, ff_P_R } from "../../constants/fonts";
import { hp, wp } from "../../helpers/utils";
import { ItemData } from "../../types/event";
import { ListenerAction } from "../../types/utils";
import { useList } from "./useList";
import { sh } from "../../constants/appConstants";

const AgendaList = () => {
  const {
    events,
    buttonFlag,
    selectedEvent,
    onCardTap,
    selectedGroup,
    isInfoVisisble,
    setIsInfoVisisble,
    setSelectedEvent,
    setButtonFlag,
    createEvent,
    eventIds,
    deleteEvent,
    isDeleteEvent,
    isCreateEvent,
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
  } = useList();

  const RenderItem = ({
    duration,
    hour,
    title,
    summary,
    id,
    groupName,
  }: ItemData) => {
    if (!title) {
      return (
        <View style={[renderItemStyles.listItemCOntainer]}>
          <View style={[renderItemStyles.listItem]}>
            <View style={[renderItemStyles.childCOntainer, { flex: 1 }]}>
              <Text
                onPress={() => {
                  selectedGroup && bottomSheetRef.current?.present();
                }}
                style={renderItemStyles.summary}
              >
                {selectedGroup
                  ? "Nothing planned. Tap to create."
                  : "Nothing planned."}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View
        style={[
          renderItemStyles.listItemCOntainer,
          { marginTop: hp(8), marginBottom: hp(2) },
        ]}
      >
        <Pressable
          onPress={() => onCardTap(id)}
          style={[
            renderItemStyles.listItem,
            { paddingLeft: wp(8) },
            { backgroundColor: background.card + o50 },
            selectedEvent == id && {
              backgroundColor: background.card + o75,
            },
          ]}
        >
          <View style={[renderItemStyles.childCOntainer, { flex: 1 }]}>
            <Text style={[renderItemStyles.title]}>{title}</Text>
            <Text style={renderItemStyles.summary}>{summary}</Text>
          </View>
          <View
            style={[
              renderItemStyles.childCOntainer,
              { flexDirection: "row", justifyContent: "flex-end" },
            ]}
          >
            <Text style={renderItemStyles.hour}>{hour} </Text>
            <Text style={renderItemStyles.hour}>({duration})</Text>
          </View>
          {eventIds.has(id) &&
            selectedEvent != id &&
            actions &&
            actions[id] && (
              <>
                {actions[id].has(ListenerAction.MessageReceived) ? (
                  <Text style={renderItemStyles.notificationText}>
                    New Chat
                  </Text>
                ) : (
                  <Text style={renderItemStyles.notificationText}>New</Text>
                )}
              </>
            )}
          {!selectedGroup && (
            <Text style={renderItemStyles.groupName}>{groupName}</Text>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <CalendarProvider
          onMonthChange={(e) => setDate(String(e.dateString))}
          date={date}
          theme={{
            todayButtonFontFamily: "Poppins-Medium",
            todayButtonTextColor: text.link,
          }}
        >
          <View
            style={[
              styles.listParent,
              (isInfoVisisble || isChatVisible) && { marginBottom: hp(210) },
            ]}
          >
            <List
              sections={items}
              contentContainerStyle={{ paddingBottom: hp(50) }}
              ListEmptyComponent={() =>
                isEventsLoading ? (
                  <ActivityIndicator
                    style={{ marginTop: hp(20) }}
                    color={text.primaryDark}
                  />
                ) : (
                  <Text style={renderItemStyles.emptyPlaceholder}>
                    No Event to show!
                  </Text>
                )
              }
              keyExtractor={(item) => item.id}
              renderItem={(item) => {
                return <RenderItem {...item.item} />;
              }}
              sectionStyle={{
                backgroundColor: background.primary,
              }}
            />
          </View>
        </CalendarProvider>
        <View style={styles.floatingTopCOntaioner}>
          {buttonFlag && (
            <>
              <Animated.View
                exiting={SlideOutDown.duration(500).easing(Easing.ease)}
                style={styles.floatngCOntainer}
              >
                {isDeleteEvent ? (
                  <ActivityIndicator
                    style={styles.loader}
                    color={text.primaryDark}
                  />
                ) : (
                  <>
                    <View style={styles.iconSeperator} />
                    <Icon onPress={() => deleteEvent()}>
                      <MaterialCommunityIcons
                        name="bucket"
                        size={wp(25)}
                        color={text.dark}
                      />
                    </Icon>
                    <View style={styles.iconSeperator} />
                  </>
                )}
                {!isChatVisible && (
                  <>
                    <View>
                      <Icon
                        onPress={() => {
                          deleteAction &&
                            deleteAction(
                              ListenerAction.MessageReceived,
                              selectedEvent
                            );
                          setIsChatVisible(true);
                        }}
                      >
                        <Ionicons
                          name="chatbox-ellipses"
                          size={wp(25)}
                          color={text.dark}
                        />
                      </Icon>

                      {actions &&
                        actions[selectedEvent] &&
                        actions[selectedEvent].has(
                          ListenerAction.MessageReceived
                        ) && <View style={renderItemStyles.notification} />}
                    </View>
                    <View style={styles.iconSeperator} />
                  </>
                )}
                <MaterialIcons
                  onPress={() => {
                    setSelectedEvent("");
                    setButtonFlag(false);
                    setIsChatVisible(false);
                  }}
                  name="cancel"
                  size={wp(30)}
                  color={text.google}
                />
              </Animated.View>
              {isChatVisible && (
                <ChatContainer
                  eventId={selectedEvent}
                  onClose={() => {
                    setIsChatVisible(false);
                  }}
                />
              )}
            </>
          )}
          {!buttonFlag && (
            <>
              <Animated.View
                exiting={SlideOutDown.duration(500).easing(Easing.ease)}
                style={styles.floatngCOntainer}
              >
                {selectedGroup && (
                  <>
                    {selectedGroup != "0" && (
                      <>
                        {
                          !isInfoVisisble && (
                            <Icon onPress={() => setIsInfoVisisble(true)}>
                              <FontAwesome5
                                name="info"
                                size={wp(25)}
                                color={text.dark}
                              />
                            </Icon>
                          )
                          // : (
                          //   <MaterialIcons
                          //     onPress={() => {
                          //       setIsInfoVisisble(false);
                          //     }}
                          //     name="cancel"
                          //     size={wp(30)}
                          //     color={text.google}
                          //   />
                          // )
                        }
                      </>
                    )}
                    <View style={styles.iconSeperator} />
                    {isCreateEvent ? (
                      <ActivityIndicator
                        style={styles.loader}
                        color={text.primaryDark}
                      />
                    ) : (
                      <Icon
                        onPress={() => {
                          bottomSheetRef.current?.present();
                        }}
                      >
                        <FontAwesome6
                          name="plus"
                          size={wp(25)}
                          color={text.dark}
                        />
                      </Icon>
                    )}
                  </>
                )}
                {/* {isPickerVisible && (
                <RNDateTimePicker
                  value={new Date(date)}
                  display="spinner"
                  onChange={(e) => {
                    setIsPickerVisible(false);
                    if (e.type == "set")
                      setDate(
                        moment(e.nativeEvent.timestamp).format("YYYY-MM-DD")
                      );
                  }}
                />
              )} */}
                <View style={styles.iconSeperator} />
                <Icon
                  onPress={() => {
                    calendarRef.current?.present();
                  }}
                >
                  <FontAwesome5
                    name="calendar-day"
                    size={wp(25)}
                    color={text.dark}
                  />
                </Icon>
                <View style={styles.iconSeperator} />
                <Icon
                  onPress={() => {
                    !isEventsLoading &&
                      selectedGroup != "0" &&
                      fetchEvents(selectedGroup?.id);
                  }}
                >
                  <SyncButton isLoading={isEventsLoading} />
                </Icon>
              </Animated.View>
              {selectedGroup && selectedGroup != "0" && isInfoVisisble && (
                <GroupInfoContainer groupId={selectedGroup.id} onClose={() => setIsInfoVisisble(false)} />
              )}
            </>
          )}
        </View>
      </View>
      <BottomSheetModal
        keyboardBlurBehavior="restore"
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{ backgroundColor: background.primary }}
        handleIndicatorStyle={{
          backgroundColor: background.primaryLight + o50,
        }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
            style={[
              props.style,
              { backgroundColor: `${background.secondaryDark}${o50}` },
            ]}
          />
        )}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        detached
        bottomInset={hp(30)}
        style={{ marginHorizontal: wp(20) }}
      >
        <CreateAccountSheet
          onCreate={(title, description, start, end) => {
            bottomSheetRef.current?.forceClose();
            const id: string =
              selectedGroup && selectedGroup != "0" ? selectedGroup.id : "";
            createEvent(id, title, description, start, end);
          }}
        />
      </BottomSheetModal>
      <BottomSheetModal
        backgroundStyle={{ backgroundColor: background.secondaryDark + o50 }}
        ref={calendarRef}
        snapPoints={[sh]}
        enablePanDownToClose={false}
        handleComponent={() => <></>}
        enableContentPanningGesture={false}
        enableOverDrag={false}
      >
        <BottomSheetView style={styles.sheetView}>
          <Calendar
            onDateTapped={(date) => {
              calendarRef.current?.forceClose();
              setDate(date);
            }}
            date={date}
            onClose={() => calendarRef.current?.forceClose()}
            groupId={selectedGroup == "0" ? "" : selectedGroup?.id}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default AgendaList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background.primary,
    paddingBottom: hp(10),
  },
  floatingTopCOntaioner: {
    position: "absolute",
    bottom: hp(20),
    right: 0,
  },
  floatngCOntainer: {
    flexDirection: "row",
    alignItems: "center",
    height: hp(25),
    justifyContent: "flex-end",
    marginRight: wp(20),
  },
  addEventText: {
    fontSize: wp(16),
    color: text.placeholder,
    ...ff_P_B,
  },
  addEventButton: {
    height: hp(25),
    backgroundColor: background.primary,
    elevation: 4,
    justifyContent: "center",
    paddingHorizontal: wp(10),
    borderRadius: wp(15),
    marginHorizontal: wp(15),
  },
  listParent: {
    flex: 1,
  },
  iconSeperator: {
    width: wp(15),
  },
  loader: {
    marginHorizontal: wp(15),
  },
  sheetView: {
    height: sh,
    width: "100%",
  },
});

const renderItemStyles = StyleSheet.create({
  listItemCOntainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: wp(20),
  },
  listItem: {
    width: "100%",
    borderRadius: wp(10),
    paddingVertical: hp(5),
  },
  childCOntainer: {
    marginRight: wp(10),
  },
  hour: {
    fontSize: wp(14),
    color: text.secondaryLight,
    ...ff_P_R,
    textAlign: "right",
  },
  duration: {
    fontSize: wp(10),
    color: text.placeholder,
    ...ff_P_R,
  },
  title: {
    fontSize: wp(16),
    color: text.mint + o75,
    ...ff_P_B,
    lineHeight: hp(17),
  },
  summary: {
    fontSize: wp(12),
    color: text.header,
    ...ff_P_M,
  },
  notification: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
    backgroundColor: text.google,
    position: "absolute",
    right: wp(-5),
  },
  notificationText: {
    fontSize: wp(8),
    ...ff_P_M,
    color: text.crimson,
    position: "absolute",
    top: hp(-5),
  },
  emptyPlaceholder: {
    fontSize: wp(12),
    color: text.placeholder,
    ...ff_P_R,
    width: "100%",
    textAlign: "center",
    marginTop: hp(20),
  },
  groupName: {
    fontSize: wp(12),
    ...ff_P_B,
    position: "absolute",
    right: 0,
    top: hp(-8),
    color: text.header,
  },
});
