import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import auth from "@react-native-firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import uuid from "react-native-uuid";

import moment from "moment";
import { sw } from "../constants/appConstants";
import { background, border, text } from "../constants/colors";
import { ff_P_B, ff_P_M, ff_P_R, ff_P_SM } from "../constants/fonts";
import { ListenerContext } from "../context/Listener";
import { hp, wp } from "../helpers/utils";
import { getChats, postChat } from "../services/apiHandler";
import { Chat } from "../types/event";
import { CHatContainerProps } from "../types/props";
import { showToast } from "./Toast";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ListenerAction } from "../types/utils";

const ChatContainer = ({ eventId, onClose }: CHatContainerProps) => {
  const [message, setMessage] = useState<string>("");
  const [chatId, setChatId] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [userId, userName] = useMemo(() => {
    return [
      auth().currentUser?.uid ?? "",
      auth().currentUser?.displayName ?? "",
    ];
  }, []);
  const queryClient = useQueryClient();
  const { register } = useContext(ListenerContext);
  const { deleteAction } = useContext(ListenerContext);

  useEffect(() => {
    register &&
      register((id: string, chat: Chat) => {
        if (id == eventId) {
          setChats((pre) => [chat, ...pre]);
          deleteAction && deleteAction(ListenerAction.MessageReceived, eventId);
        }
      });
    return () => {
      register && register(undefined);
    };
  }, []);
  useEffect(() => {
    chatId != "" && paginatedFetch();
  }, [chatId]);
  useEffect(() => {
    fetchChats();
  }, [eventId]);
  const paginatedFetch = async () => {
    try {
      const res = await getChats(eventId, chatId);
      setChats((pre) => [...pre, ...res]);
    } catch (error: any) {
      if (error.response) showToast(error.response.data.message);
      else showToast("Cant fetch chats right now");
    }
  };
  const fetchChats = async () => {
    setIsFetching(true);
    try {
      const res = await getChats(eventId, chatId);
      setChats(res);
    } catch (error: any) {
      if (error.response) showToast(error.response.data.message);
      else showToast("Cant fetch chats right now");
    }
    setIsFetching(false);
  };
  const postMessage = async () => {
    try {
      const newMessage: Chat = {
        chat: message,
        id: `temp-${uuid.v4()}`,
        senderId: userId,
        senderName: userName,
        timeStamp: new Date().toString(),
      };
      setChats((pre) => [newMessage, ...pre]);
      setMessage("");
      await postChat(eventId, newMessage.chat);
    } catch (error: any) {
      if (error.response) showToast(error.response.data.message);
      else showToast("Cant post chat right now");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.child}>
        <View style={styles.chatContainer}>
          {isFetching && <ActivityIndicator color={text.primaryDark} />}
          {!isFetching && (
            <>
              {chats.length > 0 ? (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  onEndReached={(info) => {
                    setChatId(chats.at(-1)?.id ?? "");
                  }}
                  contentContainerStyle={{
                    width: "100%",
                  }}
                  onEndReachedThreshold={0}
                  data={chats}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={styles.messageContainer}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.sender}>
                            {item.senderId == userId ? "You" : item.senderName}
                          </Text>
                          <Text style={styles.sender}>
                            {moment(item.timeStamp).format("MM/DD hh:mm A")}
                          </Text>
                        </View>
                        <Text style={styles.message}>{item.chat}</Text>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item.id}
                  inverted
                />
              ) : (
                <Text style={styles.emptyPlaceholder}>No chat to show</Text>
              )}
            </>
          )}
          <Feather
            onPress={onClose}
            style={styles.minimizeIcon}
            name="minimize-2"
            size={wp(20)}
            color={text.placeholder}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={setMessage}
            value={message}
            placeholder="Message"
            style={styles.textInput}
            multiline
            placeholderTextColor={text.placeholder}
          />
          <MaterialCommunityIcons
            onPress={postMessage}
            name="send-circle"
            size={wp(40)}
            color={background.buttonLight}
          />
        </View>
      </View>
    </View>
  );
};

export default ChatContainer;

const styles = StyleSheet.create({
  container: {
    width: sw,
    height: hp(180),
    marginTop: hp(10),
    alignItems: "center",
  },
  child: {
    width: "95%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: border,
    borderRadius: 10,
    paddingHorizontal: wp(10),
    paddingVertical: hp(8),
    backgroundColor: background.primary,
  },
  textInput: {
    flex: 1,
    height: hp(35),
    backgroundColor: background.secondary,
    borderRadius: 8,
    paddingLeft: wp(16),
    fontSize: wp(14),
    ...ff_P_SM,
    marginRight: wp(4),
    color: text.placeholder,
  },
  chatContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  emptyPlaceholder: {
    fontSize: wp(12),
    color: text.placeholder,
    ...ff_P_R,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(10),
  },
  minimizeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  messageContainer: {
    width: "100%",
    marginTop: hp(8),
    borderRadius: wp(8),
    padding: wp(8),
    backgroundColor: background.secondary,
  },
  sender: {
    fontSize: wp(10),
    color: text.primaryDark,
    ...ff_P_B,
  },
  message: {
    fontSize: wp(12),
    color: text.subHeader,
    ...ff_P_M,
  },
});
