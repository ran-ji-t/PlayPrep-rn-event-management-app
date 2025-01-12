import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";

import { MainStackParamsListBase } from "../types/navigationParamListBase";
import Drawer from "./Drawer/Drawer";
import Profile from "./Profile";
import Settings from "./Settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "../components/Toast";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const Stack = createNativeStackNavigator<MainStackParamsListBase>();
const queryClient = new QueryClient();
const Main = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Drawer" component={Drawer} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Navigator>
        </BottomSheetModalProvider>
      </QueryClientProvider>
      <Toast />
    </GestureHandlerRootView>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
