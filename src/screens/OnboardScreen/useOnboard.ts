import { useNavigation } from "@react-navigation/native";

import { OnboardNavigationProp } from "../../types/props";
import { googleSignupHandler } from "../../services/firebaseAuthHandler";
import { showToast } from "../../components/Toast";

export const useOnboard = () => {
  const { replace } = useNavigation<OnboardNavigationProp>();

  const navigateToLogin = () => replace("Login");
  const navigateToSignUp = () => replace("Signup");
  const handleSSOLogin = async () => {
    try {
      await googleSignupHandler();
    } catch (error: any) {
      showToast(error.message)
    }
  };

  return {
    navigateToLogin,
    navigateToSignUp,
    handleSSOLogin,
  };
};
