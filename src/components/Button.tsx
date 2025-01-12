import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { background, o25, o75, text } from "../constants/colors";
import { hp, wp } from "../helpers/utils";
import { ButtonProps } from "../types/props";

const Button = ({
  buttonText,
  onPress,
  activeOpacity,
  backgroundColor,
  textColor,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        backgroundColor && { backgroundColor: backgroundColor + o75 },
      ]}
      activeOpacity={activeOpacity || 0.7}
    >
      <Text style={[styles.buttonText, textColor && { color: textColor }]}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: hp(45),
    backgroundColor: background.buttonDark + o25,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(10),
  },
  buttonText: {
    fontSize: wp(16),
    color: text.buttonPrimary,
    fontFamily: "Poppins-Bold",
  },
});
