import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Root from "./src/screens/Root";

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Root />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
