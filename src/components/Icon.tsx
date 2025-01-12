import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { IconProps } from "../types/props";
import { wp } from "../helpers/utils";
import { background, o50, o75, o90 } from "../constants/colors";

const Icon = ({ children, onPress }: IconProps) => {
  return <Pressable onPress={onPress} style={styles.container}>{children}</Pressable>;
};

export default Icon;

const styles = StyleSheet.create({
  container: {
    width: wp(50),
    height: wp(50),
    backgroundColor: background.tertiary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(8),
  },
});
