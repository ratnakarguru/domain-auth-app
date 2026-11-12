import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseError } from "firebase/app";
// Firebase 13 publishes Web types here; Metro selects its React Native export at runtime.
// @ts-expect-error React Native-only export is missing from the published Web declarations.
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import app from "./firebaseApp";

function createAuth() {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (error instanceof FirebaseError && error.code === "auth/already-initialized") {
      return getAuth(app);
    }
    throw error;
  }
}

export const auth = createAuth();
export default app;
