
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { DOMAIN_ERROR, isAllowedDomain } from "../utils/domainValidator";
import { clearGoogleSession, signInWithGoogle } from "./googleSignIn";

export async function loginWithGoogle() {
  const result = await signInWithGoogle();
  if (!result) return;

  const { user } = result;
  const rejectionMessage = !user.email || !isAllowedDomain(user.email)
    ? DOMAIN_ERROR
    : !user.emailVerified ? "Google email could not be verified." : null;
  if (rejectionMessage) {
    await signOut(auth).catch((error) => {
      console.error("Could not clear rejected Firebase session:", error);
    });
    throw new Error(rejectionMessage);
  }
}

export async function logout() {
  await signOut(auth);
  await clearGoogleSession().catch((error) => {
    console.error("Could not clear Google account selection:", error);
  });
}
