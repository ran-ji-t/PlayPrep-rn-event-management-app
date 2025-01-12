import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerHeaderProps,
} from "@react-navigation/drawer";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Icon from "../../components/Icon";
import { sh } from "../../constants/appConstants";
import {
  background,
  border,
  o15,
  o50,
  o75,
  text,
} from "../../constants/colors";
import { ff_P_B, ff_P_M, ff_P_R, ff_P_SM } from "../../constants/fonts";
import { GroupContext } from "../../context/Group";
import { ListenerContext } from "../../context/Listener";
import { hp, wp } from "../../helpers/utils";
import { DrawerParamsListBase } from "../../types/navigationParamListBase";
import AgendaList from "../AgendaList/AgendaList";
import { useDrawer } from "./useDrawer";
import { DateContext } from "../../context/Date";
import moment from "moment";
import SwipeHeader from "../../components/SwipeHeader";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

const DrawerNavigator = createDrawerNavigator<DrawerParamsListBase>();
const Drawer = () => {
  const {
    code,
    setCode,
    user,
    joinGroup,
    groups,
    selectedGroup,
    title,
    setSelecetdGroup,
    logout,
    navigateTo,
    isFetching,
    createGroup,
    actions,
    eventIds,
    groupIds,
    updateActions,
    updateEventIds,
    updateGroupIds,
    deleteAction,
    deleteEventId,
    deleteGroupId,
    groupDescription,
    groupTitle,
    setGroupDescription,
    setTitle,
    register,
    refetch,
    date,
    setDate,
    createSheetRef,
    joinSheetRef,
  } = useDrawer();
  const [isOpened, setIsopened] = useState(true);
  const eventsCount = useMemo(
    () => groups.reduce((res: number, cur) => res + cur.count, 0),
    [groups]
  );

  useEffect(() => {
    if (
      selectedGroup &&
      selectedGroup != "0" &&
      groupIds.has(selectedGroup.id)
    ) {
      deleteGroupId(selectedGroup.id);
    } else if (!selectedGroup) {
      groupIds.forEach((id) => deleteGroupId(id));
    }
  }, [groupIds]);
  const header = ({ navigation }: DrawerHeaderProps) => {
    return (
      <View style={{ backgroundColor: background.primary }}>
        <SafeAreaView
          onLayout={navigation.openDrawer}
          style={styles.headerContainer}
          edges={["top"]}
        >
          <View style={{ flexDirection: "row" }}>
            <View>
              <Pressable
                style={[styles.pressable]}
                onPress={navigation.openDrawer}
              >
                <Entypo name="menu" size={wp(25)} color={text.subHeader} />
              </Pressable>
              {groupIds.size > 0 && <View style={styles.notification} />}
            </View>
            <Text style={styles.headerTitle}>{title} Events</Text>
          </View>
          <SwipeHeader date={date} onChange={setDate} />
        </SafeAreaView>
      </View>
    );
  };
  const drawerContent = ({ navigation }: DrawerContentComponentProps) => {
    return (
      <View style={[contentStyles.container]}>
        <SafeAreaView
          edges={["top"]}
          style={[
            contentStyles.container,
            contentStyles.safeAreaView,
            {
              backgroundColor: background.buttonDark + o15,
              paddingBottom: 0,
            },
          ]}
        >
          <View
            style={{
              paddingHorizontal: wp(10),
              marginBottom: hp(20),
            }}
          >
            <Text style={contentStyles.name}>{user?.displayName}</Text>
            <Text style={contentStyles.email}>{user?.email}</Text>
            {/* <View style={contentStyles.inputCOntainer}>
              <TextInput
                value={code}
                onChangeText={(val) => setCode(val.toUpperCase())}
                maxLength={6}
                placeholder="Code"
                placeholderTextColor={text.placeholder}
                style={contentStyles.textInput}
              />
              <MaterialIcons
                onPress={() =>
                  joinGroup(() => {
                    setCode("");
                    navigation.closeDrawer();
                  })
                }
                name="add-box"
                size={wp(55)}
                color={background.buttonLight}
              />
            </View> */}
          </View>
          <View
            style={{
              flex: 1,
              paddingHorizontal: wp(10),
              paddingBottom: hp(5),
            }}
          >
            <Pressable
              onPress={() => {
                navigation.closeDrawer();
                setSelecetdGroup(undefined);
                setCode("");
                groupIds.forEach((id) => deleteGroupId(id));
              }}
              style={[
                contentStyles.listItemCOntainer,
                {
                  marginTop: hp(10),
                  alignItems: "center",
                  marginLeft: wp(-8),
                  borderEndEndRadius: wp(20),
                  borderTopEndRadius: wp(20),
                  justifyContent: "space-between",
                },
                !selectedGroup && selectedBackgroun,
              ]}
            >
              <Text style={[contentStyles.listTitle, { marginLeft: wp(18) }]}>
                All
              </Text>
              <View
                style={{
                  width: wp(60),
                  height: hp(15),
                  borderRadius: wp(10),
                  backgroundColor: `${background.buttonDark}A0`,
                  justifyContent: "center",
                  marginRight: wp(8),
                }}
              >
                <Text
                  style={{
                    fontSize: wp(10),
                    color: text.textPrimary,
                    ...ff_P_M,
                    textAlign: "center",
                  }}
                >
                  {eventsCount > 1
                    ? `${eventsCount} Events`
                    : `${eventsCount} Event`}
                </Text>
              </View>
            </Pressable>
            {/* <View style={contentStyles.listItemCOntainer}>
              <View
                style={[
                  styles.point,
                  selectedGroup == "0" && {
                    backgroundColor: background.primaryDark,
                  },
                ]}
              ></View>
              <Text
                onPress={() => {
                  navigation.closeDrawer();
                  setSelecetdGroup("0");
                  setCode("");
                }}
                style={contentStyles.listTitle}
              >
                {" "}
                Personal Events
              </Text>
            </View> */}
            <Text
              style={[
                contentStyles.listTitle,
                ff_P_B,
                {
                  color: text.primaryDark,
                  marginTop: hp(10),
                },
              ]}
            >
              Groups :
            </Text>
            <View
              style={[contentStyles.listCOntainer, { marginRight: wp(-10) }]}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <View style={contentStyles.emptyCOmpontnContainer}>
                    {isFetching ? (
                      <ActivityIndicator
                        size={wp(30)}
                        color={text.placeholder}
                      />
                    ) : (
                      <Text style={contentStyles.emptyPlaceholder}>
                        No group to show!
                      </Text>
                    )}
                  </View>
                )}
                keyExtractor={(item) => item.id}
                data={groups}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      navigation.closeDrawer();
                      setSelecetdGroup(item);
                      setCode("");
                      deleteGroupId(item.id);
                    }}
                    style={[
                      contentStyles.listItemCOntainer,
                      {
                        marginTop: hp(10),
                        alignItems: "center",
                        borderBottomStartRadius: wp(20),
                        borderTopStartRadius: wp(20),
                        paddingLeft: wp(20),
                        justifyContent: "space-between",
                      },
                      selectedGroup &&
                        selectedGroup != "0" &&
                        selectedGroup.id == item.id &&
                        selectedBackgroun,
                    ]}
                  >
                    <Text style={[contentStyles.groupItem]}> {item.name}</Text>
                    <View
                      style={{
                        width: wp(60),
                        height: hp(15),
                        borderRadius: wp(10),
                        backgroundColor: `${background.buttonDark}A0`,
                        justifyContent: "center",
                        marginRight: wp(18),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: wp(10),
                          color: text.textPrimary,
                          ...ff_P_M,
                          textAlign: "center",
                        }}
                      >
                        {item.count > 1
                          ? `${item.count} Events`
                          : `${item.count} Event`}
                      </Text>
                    </View>
                    {groupIds.has(item.id) &&
                      (item != selectedGroup || isOpened) && (
                        <View style={styles.notification} />
                      )}
                  </Pressable>
                )}
              />
              <View style={contentStyles.addIconContainer}>
                <Icon onPress={() => joinSheetRef.current?.present()}>
                  <Ionicons name="enter" size={wp(25)} color={text.dark} />
                </Icon>
                <View style={{ height: hp(10) }} />
                <Icon onPress={() => createSheetRef.current?.present()}>
                  <Ionicons name="create" size={wp(25)} color={text.dark} />
                </Icon>
              </View>
            </View>
            <View style={contentStyles.border} />
            <View style={contentStyles.bottomCOntainer}>
              <MaterialCommunityIcons
                style={[contentStyles.icon, { marginLeft: 0 }]}
                name="logout"
                size={wp(30)}
                color={text.logout}
                onPress={logout}
              />
              <View style={contentStyles.bottomRigthCOntainer}>
                <Octicons
                  style={contentStyles.icon}
                  name="person-fill"
                  size={wp(25)}
                  color={text.placeholder}
                  onPress={() => navigateTo("Profile")}
                />
                <FontAwesome
                  style={contentStyles.icon}
                  name="cog"
                  size={wp(25)}
                  color={text.placeholder}
                  onPress={() => navigateTo("Settings")}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
        <BottomSheetModal
          backgroundStyle={{ backgroundColor: background.secondaryDark + o50 }}
          ref={createSheetRef}
          snapPoints={[sh]}
          enablePanDownToClose={false}
          handleComponent={() => <></>}
        >
          <BottomSheetView style={styles.sheetView}>
            <Pressable
              onPress={() => createSheetRef.current?.forceClose()}
              style={modalStyles.container}
            >
              <Pressable style={modalStyles.child}>
                <TextInput
                  value={groupTitle}
                  onChangeText={setTitle}
                  placeholder="Enter title"
                  style={modalStyles.textInput}
                  placeholderTextColor={text.placeholder}
                />
                <TextInput
                  onChangeText={setGroupDescription}
                  value={groupDescription}
                  multiline
                  placeholder="Enter Description"
                  placeholderTextColor={text.placeholder}
                  style={[
                    modalStyles.textInput,
                    {
                      marginTop: hp(10),
                      height: hp(100),
                      verticalAlign: "top",
                      paddingTop: hp(10),
                      marginBottom: hp(15),
                    },
                  ]}
                />
                <Pressable
                  onPress={() => createGroup(() => {
                    createSheetRef.current?.forceClose()
                    navigation.closeDrawer()
                  })}
                  style={modalStyles.button}
                >
                  <Text style={modalStyles.buttonText}>Create</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          </BottomSheetView>
        </BottomSheetModal>
        <BottomSheetModal
          backgroundStyle={{ backgroundColor: background.secondaryDark + o50 }}
          ref={joinSheetRef}
          snapPoints={[sh]}
          enablePanDownToClose={false}
          handleComponent={() => <></>}
        >
          <BottomSheetView style={styles.sheetView}>
            <Pressable
              onPress={() => joinSheetRef.current?.forceClose()}
              style={modalStyles.container}
            >
              <Pressable style={modalStyles.child}>
                <TextInput
                  onChangeText={setCode}
                  value={code}
                  multiline
                  placeholder="Group Code"
                  placeholderTextColor={text.placeholder}
                  style={[
                    modalStyles.textInput,
                    {
                      marginBottom: hp(15),
                    },
                  ]}
                />
                <Pressable
                  onPress={() =>
                    joinGroup(() => {
                      setCode("");
                      joinSheetRef.current?.forceClose()
                      navigation.closeDrawer();
                    })
                  }
                  style={modalStyles.button}
                >
                  <Text style={modalStyles.buttonText}>Join</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DateContext.Provider
        value={{
          date,
          setDate,
        }}
      >
        <GroupContext.Provider
          value={{
            selectedGroup,
          }}
        >
          <ListenerContext.Provider
            value={{
              groupIds,
              eventIds,
              actions,
              updateActions,
              updateEventIds,
              updateGroupIds,
              deleteAction,
              deleteEventId,
              deleteGroupId,
              register,
            }}
          >
            <DrawerNavigator.Navigator drawerContent={drawerContent}>
              <DrawerNavigator.Screen
                options={{ header }}
                name="Agenda"
                initialParams={{
                  isDrawerOpened(flag) {
                    setIsopened(flag);
                  },
                  onEventCreate() {
                    refetch();
                  },
                  onEventDeleted() {
                    refetch();
                  },
                }}
                component={AgendaList}
              />
            </DrawerNavigator.Navigator>
          </ListenerContext.Provider>
        </GroupContext.Provider>
      </DateContext.Provider>
    </View>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  sheetView: {
    height: sh,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: background.primary,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    paddingTop: hp(10),
    paddingBottom: hp(5),
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(15),
    backgroundColor: background.buttonDark + o15,
  },
  icon: {
    width: wp(40),
    height: wp(40),
  },
  pressable: {
    borderRadius: wp(20),
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: wp(17),
    color: text.subHeader,
    ...ff_P_M,
    marginHorizontal: wp(10),
  },
  fillView: {
    width: wp(30),
  },
  point: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(10),
    borderWidth: 0.5,
  },
  notification: {
    position: "absolute",
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
    backgroundColor: text.google,
    left: 0,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: `${background.secondaryDark}${o50}`,
    justifyContent: "center",
    paddingHorizontal: wp(15),
  },
  child: {
    width: "100%",
    padding: wp(8),
    borderRadius: wp(10),
    backgroundColor: background.primary,
  },
  textInput: {
    width: "100%",
    height: hp(40),
    backgroundColor: background.secondary,
    borderRadius: 8,
    paddingLeft: wp(16),
    fontSize: wp(14),
    ...ff_P_SM,
    color: text.placeholder,
  },
  button: {
    width: wp(100),
    height: hp(30),
    backgroundColor: background.buttonLight + o75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(30),
    alignSelf: "flex-end",
  },
  buttonText: {
    fontSize: wp(15),
    color: text.textPrimary,
    ...ff_P_SM,
  },
});

const contentStyles = StyleSheet.create({
  container: {
    flex: sh,
    backgroundColor: background.primary,
  },
  safeAreaView: {
    paddingVertical: hp(10),
  },
  name: {
    fontSize: wp(25),
    color: text.header,
    ...ff_P_B,
  },
  email: {
    fontSize: wp(15),
    color: text.subHeader,
    ...ff_P_M,
  },
  inputCOntainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: hp(10),
    alignItems: "center",
    marginBottom: hp(10),
  },
  textInput: {
    flex: 1,
    height: hp(35),
    borderWidth: 1,
    borderColor: border,
    borderRadius: 10,
    paddingLeft: wp(8),
    ...ff_P_M,
  },
  listTitle: {
    fontSize: wp(16),
    color: text.subHeader,
    ...ff_P_SM,
    marginLeft: wp(10),
  },
  groupItem: {
    fontSize: wp(16),
    color: text.placeholder,
    ...ff_P_SM,
    lineHeight: hp(33),
  },
  listCOntainer: {
    flex: 1,
    marginBottom: hp(8),
  },
  addIconContainer: {
    position: "absolute",
    bottom: hp(10),
    right: wp(10),
  },
  bottomCOntainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: hp(30),
    alignItems: "center",
  },
  icon: {
    marginLeft: wp(20),
  },
  border: {
    width: "100%",
    borderTopWidth: 1,
    borderColor: border,
  },
  contentCOntainerSTyle: {
    flex: 1,
  },
  emptyCOmpontnContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyPlaceholder: {
    fontSize: wp(12),
    color: text.placeholder,
    ...ff_P_R,
  },
  bottomRigthCOntainer: {
    flexDirection: "row",
  },
  point: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: border,
  },
  listItemCOntainer: {
    flexDirection: "row",
    alignItems: "center",
    height: hp(33),
  },
});

const selectedBackgroun = {
  backgroundColor: background.buttonLight + o50,
};
