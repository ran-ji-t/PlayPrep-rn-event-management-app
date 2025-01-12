import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";
import { background, text } from "../constants/colors";
import { hp, wp } from "../helpers/utils";
import { ff_P_M } from "../constants/fonts";

export const showToast = (message: string) =>
  Toast.show({
    type: "tomatoToast",
    text1: message,
  });
const CustomToast = () => {
  const config: ToastConfig = {
    tomatoToast: ({ text1 }) => (
      <View style={style.container}>
        <Text style={style.text1}>{text1}</Text>
      </View>
    ),
  };

  return <Toast autoHide position="bottom" config={config} />;
};

export default CustomToast;

const style = StyleSheet.create({
  container: {
    backgroundColor: background.primaryDark,
    borderRadius: 10,
  },
  text1: {
    color: text.buttonPrimary,
    marginVertical: hp(5),
    textAlign: "center",
    fontSize: wp(10),
    marginHorizontal: wp(20),
    ...ff_P_M,
  },
});
