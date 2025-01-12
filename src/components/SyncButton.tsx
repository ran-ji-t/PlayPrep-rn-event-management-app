import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { text } from "../constants/colors";
import { wp } from "../helpers/utils";
import { SyncButtonProps } from "../types/props";

const SyncButton = ({ isLoading }: SyncButtonProps) => {
  const rotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    if (isLoading) rotation.value = withTiming(-360, { duration: 500 });
    else rotation.value = 0;
  }, [isLoading]);

  return (
    <Animated.View style={[animatedStyle]}>
      <MaterialCommunityIcons name="sync" size={wp(30)} color={text.dark} />
    </Animated.View>
  );
};

export default SyncButton;
