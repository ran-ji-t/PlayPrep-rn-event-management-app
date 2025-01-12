import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { logMessage } from "../helpers/logger";
import { LogLevel } from "../types/utils";

export const googleSignupHandler = async () => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    const signInResult = await GoogleSignin.signIn();
    let idToken = signInResult.data?.idToken;
    if (idToken) {
      const cred = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(cred);
    }
    if (!idToken) {
      throw new Error("No ID token found");
    }
  } catch (error: any) {
    logMessage(LogLevel.Error, error.message, "google sign up service");
    throw error;
  }
};

export const emailPasswordSignup = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
    await auth().currentUser?.updateProfile({
      displayName,
    });
  } catch (error: any) {
    logMessage(LogLevel.Error, error.message, "email/password sign up service");
    throw error;
  }
};

export const emailPasswordLogin = async (email: string, password: string) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
  } catch (error: any) {
    logMessage(LogLevel.Error, error.message, "email/password sign in service");
    throw error;
  }
};

export const signOutHandler = async () => {
  try {
    const user = auth().currentUser;
    if (!user?.providerData || !user.providerData[0]) {
      throw new Error("No auth provider found");
    }
    if (user.providerData[0].providerId == "google.com") {
      await GoogleSignin.signOut();
    }
    await auth().signOut();
  } catch (error: any) {
    logMessage(LogLevel.Error, error.message, "sign out service");
    throw error;
  }
};
