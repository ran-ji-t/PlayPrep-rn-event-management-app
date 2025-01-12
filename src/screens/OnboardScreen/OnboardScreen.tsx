import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/Header";
import { background, text } from "../../constants/colors";
import { hp, wp } from "../../helpers/utils";
import Button from "../../components/Button";
import { useOnboard } from "./useOnboard";
import SSO from "../../components/SSO";

const OnboardScreen = () => {
  const { handleSSOLogin, navigateToLogin, navigateToSignUp } = useOnboard();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Welcome to the collaborative space." />
      <View style={styles.bottomContainer}>
        <Button buttonText="Log in" onPress={navigateToLogin} />
        <Button
          buttonText="Sign up"
          onPress={navigateToSignUp}
          backgroundColor={background.buttonLight}
          textColor={text.buttonSecondary}
        />
        <View style={styles.emptyContainer} />
        <SSO onPress={handleSSOLogin} />
      </View>
    </SafeAreaView>
  );
};

export default OnboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background.primary,
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomContainer: {
    width: "100%",
    paddingHorizontal: wp(16),
    marginBottom: hp(20),
    alignItems: "center",
  },
  emptyContainer: { height: hp(15) },
});
