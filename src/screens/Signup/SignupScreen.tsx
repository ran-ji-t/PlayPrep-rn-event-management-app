import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Octicons from "@expo/vector-icons/Octicons";

import { useSignup } from "./useSignup";
import { hp, wp } from "../../helpers/utils";
import Header from "../../components/Header";
import Button from "../../components/Button";
import SSO from "../../components/SSO";
import { background, text } from "../../constants/colors";
import { ff_P_M } from "../../constants/fonts";

const Signup = () => {
  const {
    navigateToLogin,
    email,
    handleSignUp,
    onEmailTextChange,
    onPasswordTextChange,
    onUserNameTextChange,
    password,
    toggleEye,
    userName,
    isEmailValid,
    isLoading,
    isPasswordValid,
    isUserNameValid,
    obscure,
    handleSSOLogin,
  } = useSignup();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={hp(15)}
        style={styles.keyboardAvoidingView}
      >
        <Header title="Create your account." />
        <TextInput
          placeholderTextColor={text.placeholder}
          style={styles.textInput}
          placeholder="User Name"
          value={userName}
          onChangeText={onUserNameTextChange}
        />
        {!isUserNameValid && (
            <Text style={[styles.errorText]}>Enter valid name*</Text>
        )}
        <TextInput
          placeholderTextColor={text.placeholder}
          style={[styles.textInput]}
          keyboardType="email-address"
          placeholder="Email"
          value={email}
          onChangeText={onEmailTextChange}
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
      </KeyboardAvoidingView>
      <View style={styles.emptyContainer} />
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={background.primaryDark} size={hp(20)} />
        </View>
      ) : (
        <Button buttonText="Sign up" onPress={handleSignUp} />
      )}
      <Text style={styles.span}>
        Already have an Account?{" "}
        <Text
          onPress={navigateToLogin}
          suppressHighlighting
          style={styles.login}
        >
          Log in
        </Text>
      </Text>
      <View style={styles.itemSeperator} />
      <SSO onPress={handleSSOLogin} />
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background.primary,
    paddingHorizontal: wp(16),
    paddingBottom: hp(20),
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    height: hp(40),
    backgroundColor: background.secondary,
    borderRadius: 8,
    marginTop: hp(10),
    paddingLeft: wp(16),
    fontSize: wp(14),
    ...ff_P_M,
    color: text.placeholder
  },
  emptyContainer: {
    marginTop: hp(20),
  },
  span: {
    fontSize: wp(12),
    color: text.span,
    ...ff_P_M,
  },
  login: {
    color: text.link,
  },
  itemSeperator: {
    flex: 1,
  },
  keyboardAvoidingView: {
    width: "100%",
  },
  loaderContainer: {
    width: "100%",
    height: hp(45),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(15),
  },
  errorText: {
    color: text.error,
    alignSelf: "flex-start",
    fontSize: wp(10),
    ...ff_P_M,
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
});
