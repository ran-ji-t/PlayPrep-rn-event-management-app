import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Octicons from "@expo/vector-icons/Octicons";

import { useLogin } from "./useLogin";
import Header from "../../components/Header";
import { hp, wp } from "../../helpers/utils";
import Button from "../../components/Button";
import SSO from "../../components/SSO";
import { background, text } from "../../constants/colors";
import { ff_P_M, ff_P_SM } from "../../constants/fonts";

const Login = () => {
  const {
    email,
    isEmailValid,
    isPasswordValid,
    obscure,
    password,
    handleLogin,
    navigateToSignUp,
    toggleEye,
    isLoading,
    onEmailTextChange,
    onPasswordTextChange,
    handleSSOLogin,
  } = useLogin();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapperContainer}>
        <Header title="Login your account." />
        <TextInput
          placeholderTextColor={text.placeholder}
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={onEmailTextChange}
          keyboardType="email-address"
        />
        {!isEmailValid && (
          <Text style={styles.errorText}>Enter valid email*</Text>
        )}
        <View style={styles.textInputContainer}>
          <TextInput
            placeholderTextColor={text.placeholder}
            style={[styles.textInput, { flex: 1, marginTop: 0 }]}
            placeholder="Password"
            secureTextEntry={obscure}
            value={password}
            onChangeText={onPasswordTextChange}
          />
          <View style={styles.eyeContainer}>
            {!obscure ? (
              <Octicons
                name="eye"
                onPress={toggleEye}
                suppressHighlighting
                size={wp(20)}
                color={text.placeholder}
              />
            ) : (
              <Octicons
                name="eye-closed"
                onPress={toggleEye}
                suppressHighlighting
                size={wp(20)}
                color={text.placeholder}
              />
            )}
          </View>
        </View>
        {!isPasswordValid && (
          <Text style={styles.errorText}>Enter valid password*</Text>
        )}
        <View style={styles.emptyContainer} />
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color={background.buttonDark} size={hp(20)} />
          </View>
        ) : (
          <Button activeOpacity={1} buttonText="Log in" onPress={handleLogin} />
        )}
        <Text style={styles.span}>
          Dont't have Account?{" "}
          <Text
            suppressHighlighting
            onPress={navigateToSignUp}
            style={styles.signUp}
          >
            Sign up
          </Text>
        </Text>
      </View>
      <View style={styles.fill} />
      <View style={styles.wrapperContainer}>
        <SSO onPress={handleSSOLogin} />
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background.primary,
    paddingHorizontal: wp(16),
    paddingBottom: hp(20),
  },
  textInput: {
    width: "100%",
    height: hp(40),
    backgroundColor: background.secondary,
    borderRadius: 8,
    marginTop: hp(10),
    paddingLeft: wp(16),
    fontSize: wp(14),
    ...ff_P_SM,
    color: text.placeholder
  },
  errorText: {
    color: text.error,
    alignSelf: "flex-start",
    fontSize: wp(10),
    ...ff_P_M,
  },
  emptyContainer: {
    marginTop: hp(20),
  },
  span: {
    fontSize: wp(12),
    color: text.span,
    ...ff_P_M,
  },
  signUp: {
    color: text.link,
  },
  wrapperContainer: {
    width: "100%",
    alignItems: "center",
  },
  textInputContainer: {
    width: "100%",
    flexDirection: "row",
    height: hp(40),
    backgroundColor: background.secondary,
    borderRadius: 8,
    marginTop: hp(10),
  },
  eyeContainer: {
    height: "100%",
    justifyContent: "center",
    width: wp(35),
    alignItems: "center",
  },
  fill: {
    flex: 1,
  },
  loaderContainer: {
    width: "100%",
    height: hp(45),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(15),
  },
});
