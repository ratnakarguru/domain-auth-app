import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../config/firebase";

GoogleSignin.configure({
  // Web OAuth client ID from the supplied google-services.json.
  webClientId: "370081725844-akkvdkh1hq0urff932q75n6ck0vbi1is.apps.googleusercontent.com",
});

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) return null;

    const idToken = response.data.idToken;
    if (!idToken) {
      throw new Error("Google did not return an ID token. Check the OAuth configuration.");
    }

    return await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code === "auth/network-request-failed") {
        throw new Error("Network error. Check your connection and try again.");
      }
      throw error;
    }
    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) return null;
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error("Google Play services are unavailable or out of date.");
      }
      throw new Error(`Google sign-in failed (${error.code}). Check your connection and OAuth setup.`);
    }
    throw error;
  }
}

export async function clearGoogleSession() {
  await GoogleSignin.signOut();
}
