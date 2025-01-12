import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

import { hp, wp } from "../helpers/utils";
import { HeaderProps } from "../types/props";
import { ff_P_SM } from "../constants/fonts";
import { background, text } from "../constants/colors";

const Header = ({ title }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.logo}
        source={require("../../assets/images/logoOutlined.png")}
      />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  logo: {
    width: wp(130),
    height: hp(70),
    marginTop: hp(60),
    marginBottom: hp(30),
  },
  text: {
    fontSize: wp(20),
    color: text.subHeader,
    textAlign: "center",
    ...ff_P_SM,
  },
  container: {
    alignItems: "center",
  },
});
