import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

import { sw } from "../constants/appConstants";
import { background, border, text } from "../constants/colors";
import { ff_P_B, ff_P_M } from "../constants/fonts";
import { hp, wp } from "../helpers/utils";
import { fetchGroupInfo } from "../services/apiHandler";
import { InfoCOntainerProps } from "../types/props";

const GroupInfoContainer = ({ groupId, onClose }: InfoCOntainerProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["group/info"],
    queryFn: () => fetchGroupInfo(groupId),
  });
  const date = useMemo(
    () => moment(data?.createDate).format("YYYY/MM/DD"),
    [data?.createDate]
  );
  console.log(error);
  return (
    <View style={styles.container}>
      <View style={styles.child}>
        {isLoading && <ActivityIndicator />}
        {!isLoading && error && <Text style={styles.oops}>Oops!</Text>}
        {!isLoading && !error && (
          <View style={styles.contectContainer}>
            <View style={styles.infoCOntainer}>
              <Text style={styles.title}>
                {data?.name}
                <Text
                  style={{
                    fontSize: wp(10),
                    color: text.primaryDark,
                  }}
                >
                  {" "}({groupId})
                </Text>
              </Text>
              <Text style={styles.description}>{data?.description}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
            <View style={styles.seperator} />
            <View style={styles.infoCOntainer}>
              <Text style={[styles.title, { fontSize: wp(18) }]}>Members:</Text>
              <FlatList
                ItemSeparatorComponent={() => (
                  <View style={styles.itemSeperator} />
                )}
                contentContainerStyle={{ paddingLeft: wp(10) }}
                data={data?.members}
                renderItem={({ item, index }) => (
                  <>
                    <Text style={styles.description}>
                      {index + 1}. {item.name}
                    </Text>
                    <Text style={[styles.description, { fontSize: wp(10) }]}>
                      {item.email}
                    </Text>
                  </>
                )}
                keyExtractor={(item) => item.email}
              />
            </View>
          </View>
        )}
        <Feather
          onPress={onClose}
          style={styles.minimizeIcon}
          name="minimize-2"
          size={wp(20)}
          color={text.placeholder}
        />
      </View>
    </View>
  );
};

export default GroupInfoContainer;

const styles = StyleSheet.create({
  minimizeIcon: {
    position: "absolute",
    top: hp(5),
    right: wp(5),
  },
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
    backgroundColor: background.primary,
  },
  oops: {
    fontSize: wp(35),
    ...ff_P_B,
    color: `${text.placeholder}50`,
  },
  contectContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  infoCOntainer: {
    flex: 1,
    paddingLeft: wp(10),
    paddingVertical: hp(10),
  },
  title: {
    fontSize: wp(25),
    color: text.primaryDark,
    ...ff_P_B,
  },
  description: {
    fontSize: wp(13),
    color: text.placeholder,
    ...ff_P_M,
    flex: 1,
  },
  date: {
    fontSize: wp(13),
    color: text.placeholder,
    ...ff_P_M,
  },
  seperator: {
    borderWidth: 0.5,
    borderColor: border,
    height: "80%",
  },
  itemSeperator: {
    height: hp(8),
  },
});
