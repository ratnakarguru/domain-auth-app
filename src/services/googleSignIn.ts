import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
        return null;
      }
      if (error.code === "auth/popup-blocked") {
        throw new Error("Allow pop-ups for this site and try Google sign-in again.");
      }
      if (error.code === "auth/unauthorized-domain") {
        throw new Error("This site is not authorized for Firebase sign-in.");
      }
      if (error.code === "auth/network-request-failed") {
        throw new Error("Network error. Check your connection and try again.");
      }
    }
    throw error;
  }
}

export async function clearGoogleSession() {
  // Firebase sign-out already clears the Web popup session.
}
