import { useNavigation } from "@react-navigation/native";
import { FirebaseError } from "firebase/app";
import { useState } from "react";

import { showToast } from "../../components/Toast";
import {
    emailPasswordSignup,
    googleSignupHandler,
} from "../../services/firebaseAuthHandler";
import { SignupNavigationProps } from "../../types/props";

export const useSignup = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [obscure, setObscure] = useState<boolean>(true);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [isUserNameValid, setIsUserNameValid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { replace } = useNavigation<SignupNavigationProps>();

  const toggleEye = () => setObscure((pre) => !pre);
  const onEmailTextChange = (val: string) => {
    setIsEmailValid(true);
    setEmail(val);
  };
  const onPasswordTextChange = (val: string) => {
    setIsPasswordValid(true);
    setPassword(val);
  };
  const onUserNameTextChange = (val: string) => {
    setIsUserNameValid(true);
    setUserName(val);
  };
  const handleSignUp = async () => {
    setIsLoading(true);
    if (userName.trim() == "") {
      setIsUserNameValid(false);
      setIsLoading(false);
      return;
    }
    try {
      await emailPasswordSignup(email, password, userName);
    } catch (error: any) {
      switch ((error as FirebaseError).code) {
        case "auth/invalid-email":
          setIsEmailValid(false);
          setIsPasswordValid(true);
          break;
        case "auth/weak-password":
          setIsPasswordValid(false);
          setIsEmailValid(true);
          showToast("Password is not strong enough.");
          break;
        case "auth/operation-not-allowed":
          showToast("email/password accounts are not enabled.");
          break;
        case "auth/email-already-in-use":
          showToast(
            "There is already an account exists with the given email address."
          );
          break;
        default:
          showToast("Something went wrong cant sign up");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };
  const navigateToLogin = () => replace("Login");
  const handleSSOLogin = async () => {
    try {
      await googleSignupHandler();
    } catch (error: any) {
      showToast(error.message);
    }
  };

  return {
    navigateToLogin,
    handleSignUp,
    email,
    password,
    userName,
    onEmailTextChange,
    onPasswordTextChange,
    onUserNameTextChange,
    toggleEye,
    obscure,
    isEmailValid,
    isPasswordValid,
    isUserNameValid,
    isLoading,
    handleSSOLogin,
  };
};
