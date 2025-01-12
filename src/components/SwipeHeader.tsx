import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { text } from "../constants/colors";
import { ff_P_B, ff_P_M } from "../constants/fonts";
import { wp } from "../helpers/utils";
import { SwipeHeaderProps } from "../types/props";

const SwipeHeader = ({ date, onChange }: SwipeHeaderProps) => {
  const currentDate = useMemo(() => moment(date), [date]);
  const [currentState, setCurrentState] = useState(
    currentDate.clone().format("MMM YYYY")
  );
  const [pastState, setPastState] = useState(
    currentDate.clone().subtract(1, "month").format("MMM YYYY")
  );
  const [futureState, setFutureState] = useState(
    currentDate.clone().add(1, "month").format("MMM YYYY")
  );
  const translationX = useSharedValue(0);
  const containerWidth = useSharedValue(0);

  useEffect(() => {
    setCurrentState(currentDate.format("MMM YYYY"))
    setPastState(currentDate.clone().subtract(1, "month").format("MMM YYYY"));
    setFutureState(currentDate.clone().add(1, "month").format("MMM YYYY"));
  }, [date]);
  useEffect(() => {
    translationX.value = 0
    onChange(moment(currentState, "MMM YYYY").toString());
  }, [currentState]);
  const pan = Gesture.Pan()
    .onChange((e) => {
      if (
        e.translationX > -containerWidth.value / 2 &&
        e.translationX < containerWidth.value / 2
      )
        translationX.value = e.translationX;
      if (e.translationX <= -(containerWidth.value / 2)) {
        translationX.value = withTiming(-containerWidth.value, {
          duration: 200,
          easing: Easing.linear,
        });
      } else if (e.translationX >= containerWidth.value / 2) {
        translationX.value = withTiming(containerWidth.value, {
          duration: 200,
          easing: Easing.linear,
        });
      }
    })
    .onFinalize((e) => {
      if (
        e.translationX > -containerWidth.value / 2 &&
        e.translationX < containerWidth.value / 2
      ) {
        translationX.value = 0;
      }
      if (e.translationX <= -(containerWidth.value / 2)) {
        runOnJS(setCurrentState)(futureState);
        runOnJS(setPastState)(currentState);
      } else if (e.translationX >= containerWidth.value / 2) {
        runOnJS(setCurrentState)(pastState);
        runOnJS(setFutureState)(currentState);
      }
    });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pan}>
        <Animated.View style={{ flexDirection: "row" }}>
          <Animated.Text
            onLayout={(e) => {
              containerWidth.value = e.nativeEvent.layout.width;
            }}
            style={[
              styles.text,
              {
                ...useAnimatedStyle(() => {
                  const opacity = interpolate(
                    translationX.value,
                    [-1 * containerWidth.value, 0, containerWidth.value],
                    [0, 1, 0]
                  );
                  return {
                    transform: [{ translateX: translationX.value }],
                    opacity,
                  };
                }),
              },
            ]}
          >
            {currentState}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.text,
              {
                ...useAnimatedStyle(() => {
                  const translateX = interpolate(
                    translationX.value,
                    [0, -1 * containerWidth.value],
                    [0, -1 * containerWidth.value]
                  );
                  const opacity = interpolate(
                    translationX.value,
                    [0, -1 * containerWidth.value],
                    [0, 1]
                  );
                  return {
                    transform: [{ translateX }],
                    opacity,
                  };
                }),
              },
            ]}
          >
            {futureState}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.text,
              {
                ...useAnimatedStyle(() => {
                  const translateX = interpolate(
                    translationX.value,
                    [0, containerWidth.value],
                    [
                      -1 * (containerWidth.value * 3),
                      -1 * (containerWidth.value * 2),
                    ]
                  );
                  const opacity = interpolate(
                    translationX.value,
                    [0, containerWidth.value],
                    [0, 1]
                  );
                  return {
                    transform: [{ translateX }],
                    opacity,
                  };
                }),
              },
            ]}
          >
            {pastState}
          </Animated.Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default SwipeHeader;

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    overflow: "hidden",
  },
  text: {
    fontSize: wp(17),
    color: text.subHeader,
    ...ff_P_M,
    width: wp(90),
    textAlign: "center",
  },
});
