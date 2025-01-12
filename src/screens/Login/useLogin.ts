import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FirebaseError } from "firebase/app";

import { LoginNavigationProp } from "../../types/props";
import {
  emailPasswordLogin,
  googleSignupHandler,
} from "../../services/firebaseAuthHandler";
import { showToast } from "../../components/Toast";

export const useLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [obscure, setObscure] = useState<boolean>(true);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { replace } = useNavigation<LoginNavigationProp>();

  const toggleEye = () => setObscure((pre) => !pre);
  const onEmailTextChange = (val: string) => {
    setIsEmailValid(true);
    setEmail(val);
  };
  const onPasswordTextChange = (val: string) => {
    setIsPasswordValid(true);
    setPassword(val);
  };
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await emailPasswordLogin(email, password);
    } catch (error) {
      switch ((error as FirebaseError).code) {
        case "auth/invalid-email":
          setIsEmailValid(false);
          setIsPasswordValid(true);
          break;
        case "auth/wrong-password":
          setIsPasswordValid(false);
          setIsEmailValid(true);
          break;
        case "auth/user-disabled":
          showToast("User corresponding to the given email has been disabled.");
          break;
        case "auth/user-not-found":
          showToast("No user corresponding to the given email.");
          break;
        default:
          showToast("Something went wrong cant sign in");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };
  const navigateToSignUp = () => replace("Signup");
  const handleSSOLogin = async () => {
    try {
      await googleSignupHandler();
    } catch (error: any) {
      showToast(error.message);
    }
  };

  return {
    email,
    password,
    obscure,
    isEmailValid,
    isPasswordValid,
    navigateToSignUp,
    handleLogin,
    toggleEye,
    isLoading,
    onEmailTextChange,
    onPasswordTextChange,
    handleSSOLogin,
  };
};
