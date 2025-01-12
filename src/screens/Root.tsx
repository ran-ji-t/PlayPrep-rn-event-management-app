import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useFonts } from "expo-font";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import Auth from "./Auth";
import Main from "./Main";

preventAutoHideAsync();
const Root = () => {
  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "CaveatBrush-Regular": require("../../assets/fonts/Caveat_Brush/CaveatBrush-Regular.ttf"),
  });
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    if (loaded || error) {
      hideAsync();
    }
  }, [loaded, error]);
  useEffect(() => {
    const unsubscribe = auth().onUserChanged(
      (user: FirebaseAuthTypes.User | null) => {
        if (user && user.displayName) setIsUser(true);
        else setIsUser(false);
      }
    );

    return unsubscribe;
  }, []);

  if (!loaded && !error) {
    return null;
  }
  return (
    <>
      <StatusBar translucent style="light" />
      {isUser ? <Main /> : <Auth />}
    </>
  );
};

export default Root;
