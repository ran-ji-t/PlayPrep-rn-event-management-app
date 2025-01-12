import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AuthStackParamsListBase } from "../types/navigationParamListBase";

import LoginScreen from "./Login/LoginScreen";
import SignupScreen from "./Signup/SignupScreen";
import OnboardScreen from "./OnboardScreen/OnboardScreen";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { WEB_CLIENT_ID } from "@env";
import Toast from "../components/Toast";

const Stack = createNativeStackNavigator<AuthStackParamsListBase>();
GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});
const Auth = () => {
  return (
    <View style={style.container}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Onboard" component={OnboardScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
      <Toast />
    </View>
  );
};

export default Auth;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
