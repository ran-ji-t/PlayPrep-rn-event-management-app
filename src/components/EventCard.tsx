import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useMemo, useState } from "react";
import { PackedEvent } from "react-native-calendars/src/timeline/EventBlock";
import moment from "moment";
import { wp } from "../helpers/utils";
import { text } from "../constants/colors";
import { ff_P_M, ff_P_R } from "../constants/fonts";
import { EventCardProps } from "../types/props";

const EventCard = ({ event, onPress, id }: EventCardProps) => {
  const start = useMemo(() => moment(event.start).format("HH:MM A"), []);
  const end = useMemo(() => moment(event.end).format("HH:MM A"), []);

  return (
    <Pressable
      style={[
        styles.event,
        { backgroundColor: event.color }
      ]}
    >
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.summary}>{event.summary}</Text>
      <Text style={styles.time}>
        {start} - {end}
      </Text>
    </Pressable>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  event: {
    height: "100%",
    width: "96%",
  },
  title: {
    fontSize: wp(14),
    color: text.primaryDark,
    ...ff_P_M,
  },
  summary: {
    fontSize: wp(10),
    color: text.placeholder,
    ...ff_P_R,
    width: "90%",
  },
  time: {
    fontSize: wp(9),
    color: text.link,
    ...ff_P_R,
    width: "90%",
  },
});
