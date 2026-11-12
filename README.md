# Domain Auth App

A small Expo app with Google sign-in through Firebase Authentication, a Login screen, and a protected Dashboard. The same source runs on Web, Android, and iOS. There is no backend or database; the route guard protects the app UI, not server data.

## Requirements

- Node.js and npm
- Access to the existing Firebase project, with Google enabled under **Authentication → Sign-in method**
- For Web: add the development hostname (for example, `localhost`) to Firebase Authentication's authorized domains and allow sign-in pop-ups
- For Android: Android SDK, an emulator with Google Play services or a device, and a native development build
- For iOS: an iOS build environment or Expo cloud build, an iOS Firebase app, and a native development build

The native Google Sign-In library does not run in Expo Go.

## Firebase and Google setup

1. **Android:** Keep the package name `com.domainauthapp.mobile`. In the Firebase project, register the SHA-1 fingerprint for the key that signs your build (debug, EAS, and release keys may differ). From a configured local Android project, `cd android` and run `./gradlew signingReport` (`.\gradlew.bat signingReport` on Windows) to inspect the local debug key. Download the refreshed `google-services.json` from Firebase and replace the root file. The supplied file has a Web OAuth client but no Android OAuth client entry, so native sign-in cannot be confirmed with it. Rebuild the native app after replacing it.
2. **iOS:** Choose and register the iOS bundle ID in the same Firebase project. Download the matching `GoogleService-Info.plist`. Once it exists, add `ios.bundleIdentifier` and `ios.googleServicesFile` to `app.json`, pointing to that file. Ensure the Google Sign-In config plugin has the reversed client ID URL scheme from the plist or iOS OAuth client, then rebuild. No iOS plist or bundle ID is supplied here, so `app.json` deliberately does not point at a nonexistent file.
3. **Web:** Use the existing Firebase Web app configuration. The Web OAuth client ID used by native sign-in is taken from the supplied Android config; if you replace the Firebase project or its Web OAuth client, update that ID in `src/services/googleSignIn.native.ts` as well.

See the [Expo Google authentication guide](https://docs.expo.dev/guides/google-authentication/) and [Google Sign-In Expo setup](https://react-native-google-signin.github.io/docs/setting-up/expo) for platform setup details.

## Install and run

```bash
npm ci
npm run web
```

For a configured Android SDK and emulator/device, run `npm run android`. On macOS with Xcode, run `npm run ios`. Each native command builds a development app that includes the Google Sign-In module. If native configuration changes, rebuild; restarting Metro alone is insufficient.

## Sign-in flow and domain rule

The Login button opens Google's account chooser on Web or native Google Sign-In on mobile. Firebase then creates/restores the app session. `AuthContext` checks the verified email before showing Dashboard, and Expo Router protects the route. Logout signs out of Firebase and returns to Login.

`src/utils/domainValidator.ts` currently has **development mode enabled**. In that mode, only the exact configured development Gmail address is accepted. Do not broaden it to other Gmail accounts. When development mode is turned off for final assignment evaluation, only complete `@hbplus.fit` email domains are accepted; lookalike domains are rejected. Restore the original development setting afterward. Rejected sign-ins display: **Access restricted. Please login using your official domain email.**

## Checks and troubleshooting

Run `npx tsc --noEmit`, `npm run lint`, `node scripts/check-domain.cjs`, and `npx expo-doctor` after installing dependencies. Check these flows on each available platform:

- Configured development Gmail signs in; another Gmail is rejected with the exact message.
- A signed-out direct visit to `/dashboard` opens Login; refresh and back navigation do not expose Dashboard.
- Restart restores an allowed native session; logout removes access and prevents repeated taps.
- Cancellation produces no error; network and OAuth configuration failures show a useful error.
- For strict-domain evaluation only, temporarily turn development mode off: `example@hbplus.fit` is allowed, while Gmail, `other.com`, and `fakehbplus.fit` are rejected. Restore development mode afterward.

If Android sign-in reports a developer/configuration error, check the package name, the SHA-1 of the actual signing key, the refreshed `google-services.json`, the Web OAuth client ID, and whether the app was rebuilt. For iOS, check the bundle ID, plist, reversed client ID scheme, and native rebuild. If Web sign-in fails, check Firebase authorized domains and browser pop-up settings.
