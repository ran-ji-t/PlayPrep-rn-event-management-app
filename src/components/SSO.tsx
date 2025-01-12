import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React from "react";

import { hp, wp } from "../helpers/utils";
import { SSOProps } from "../types/props";
import { background, border, text } from "../constants/colors";
import { ff_P_SM } from "../constants/fonts";

const SSO = ({ onPress }: SSOProps) => {
  return (
    <>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.bottmText}>or continue with</Text>
        <View style={styles.divider} />
      </View>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>GOOGLE</Text>
      </Pressable>
    </>
  );
};

export default SSO;

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: hp(10),
    paddingHorizontal: wp(16),
  },
  divider: {
    flex: 1,
    borderWidth: 0.5,
    height: 0,
    borderColor: border,
  },
  bottmText: {
    color: text.textPrimary,
    fontSize: wp(13),
    marginHorizontal: wp(10),
    ...ff_P_SM,
  },
  button: {
    backgroundColor: background.google,
    justifyContent: "center",
    alignItems: "center",
    height: hp(35),
    width: wp(165),
    borderRadius: 5,
  },
  buttonText: {
    color: text.google,
    fontSize: wp(14),
    ...ff_P_SM,
    letterSpacing: wp(2.5),
  },
});
