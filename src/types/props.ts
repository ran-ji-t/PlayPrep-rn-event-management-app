import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  AuthStackParamsListBase,
  DrawerParamsListBase,
  MainStackParamsListBase,
} from "./navigationParamListBase";
import { PackedEvent } from "react-native-calendars/src/timeline/EventBlock";
import { PropsWithChildren } from "react";
import { RouteProp } from "@react-navigation/native";

export type HeaderProps = {
  title: string;
};

export type ButtonProps = {
  onPress(): void;
  buttonText: string;
  backgroundColor?: string;
  textColor?: string;
  activeOpacity?: number;
};

export type SSOProps = {
  onPress(): void;
};

export type OnboardNavigationProp = NativeStackNavigationProp<
  AuthStackParamsListBase,
  "Onboard"
>;

export type LoginNavigationProp = NativeStackNavigationProp<
  AuthStackParamsListBase,
  "Login"
>;

export type SignupNavigationProps = NativeStackNavigationProp<
  AuthStackParamsListBase,
  "Signup"
>;

export type DrawerNavigationProps = NativeStackNavigationProp<
  MainStackParamsListBase,
  "Drawer"
>;

export type AgendaRouteProps = RouteProp<DrawerParamsListBase, "Agenda">;

export type EventCardProps = {
  event: PackedEvent;
  id: string;
  onPress(id: string): void;
};

export type InfoCOntainerProps = {
  groupId: string;
  onClose(): void
};

export type CHatContainerProps = {
  eventId: string;
  onClose: () => void;
};

export type CreatEventProps = {
  onCreate: (
    title: string,
    description: string,
    start: Date,
    end: Date
  ) => void;
};

export type CalendarComponentProps = {
  date: string;
  onClose(): void
  groupId?: string
  onDateTapped(date: string): void
};

export type IconProps = PropsWithChildren<{
  onPress(): void;
}>;

export type SyncButtonProps = {
  isLoading: boolean;
};

export type SwipeHeaderProps = {
  date: string;
  onChange: (val: string) => void;
};
