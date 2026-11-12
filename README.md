# Domain Auth App

A small Expo SDK 58 app with Google sign-in through Firebase Authentication, a Login screen, and a protected Dashboard. The same source runs on Web, Android, and iOS. There is no backend or database; the route guard protects the app UI, not server data. Future server resources would need their own authorization checks.

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

The Login button opens Google's account chooser on Web or native Google Sign-In on mobile. Native sign-in exchanges Google's ID token for a Firebase credential; the app does not store raw tokens. Firebase then creates/restores the app session. `AuthContext` checks the verified email and domain rule before showing Dashboard, and Expo Router protects the route. Logout signs out of Firebase and returns to Login. The app shows a loading indicator during session restoration; sign-in and logout buttons show progress and errors.

`src/utils/domainValidator.ts` intentionally has **development mode enabled**. In that mode, only the exact configured development Gmail address is accepted; other Gmail addresses and even `@hbplus.fit` accounts are rejected. Do not broaden the allowlist or switch the setting for a development build. When development mode is separately disabled for final assignment evaluation, only complete `@hbplus.fit` email domains are accepted; lookalike domains are rejected. That strict-mode build needs separate approval. The test script checks both modes in memory without editing the real setting. Rejected sign-ins display: **Access restricted. Please login using your official domain email.**

## Netlify Web deployment

The app exports a single-page site. `netlify.toml` builds it into `dist` and rewrites direct paths such as `/dashboard` to `index.html`, where the route guard still runs. No Netlify Functions or other hosting dependencies are needed.

1. In Netlify, import the **existing** GitHub repository `ratnakarguru/domain-auth-app`. Select production branch `main`, repository root as the base directory, build command `npx expo export --platform web`, and publish directory `dist`. The checked-in `netlify.toml` supplies the same settings.
2. After the first deployment provides the real `*.netlify.app` hostname (and any later custom hostname), add each exact hostname in Firebase Authentication **Settings → Authorized domains**. Do not change Firebase `authDomain` just for Netlify.
3. Test live sign-in with the configured development Gmail, rejection of other accounts, direct `/dashboard` access while signed out, refresh, and logout. Allow browser pop-ups if the Google chooser cannot open.

The Firebase Web configuration is already in `src/config/firebaseApp.ts`. This project does not require build-time environment variables.

## Android development build, QR, and preview APK

Expo Go does not contain the native Google Sign-In module. The installed `expo-dev-client`, Google Sign-In config plugin, and Android package `com.domainauthapp.mobile` support a custom development build. First complete the Android Firebase setup below.

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile development
```

Install the generated development APK on the Android phone. Then start Metro from this project:

```bash
npx expo start --dev-client --clear
```

Keep the phone and computer on the same Wi-Fi. From the phone, check `http://<computer-LAN-IP>:8081/status` and expect `packager-status:running`. Scan Metro's QR with the phone camera and open it in the **installed development app**, not Expo Go. If LAN access is blocked, restart with `npx expo start --dev-client --clear --tunnel`. Rebuild the native app after changing native config, plugins, or `google-services.json`; restarting Metro cannot update them.

For a separate installable **standalone preview APK** that launches without Metro:

```bash
npx eas-cli@latest build --platform android --profile preview
```

The preview profile explicitly sets `android.buildType` to `apk`.

## Android Firebase setup

The supplied root `google-services.json` has the correct Android package but only a Web OAuth client (`client_type: 3`); it has no Android OAuth client (`client_type: 1`). **Live Android Google sign-in is blocked until real Firebase and signing configuration is supplied.**

1. Find the SHA-1 for the certificate signing the *actual* development build. For EAS builds, inspect the Android credentials in your Expo account with `npx eas-cli@latest credentials --platform android`. A local debug key can be inspected with `android\gradlew.bat signingReport` after native generation. Development, preview, and Play-signed builds may use different certificates. Add SHA-256 too where Firebase asks for it.
2. In the existing Firebase project, confirm Android package `com.domainauthapp.mobile`. Add each relevant signing fingerprint to that Android app. Ensure Google is enabled in Authentication.
3. Download the **refreshed** `google-services.json` and replace the project-root file. Verify it has the Android OAuth client as well as the Web client, and that `src/services/googleSignIn.native.ts` uses the matching Web client ID.
4. Rebuild and reinstall the development/preview APKs, then test on a device with Google Play services. A Google error such as code 10 usually points to package, fingerprint, OAuth client, or stale native build configuration.

## iOS setup

The native sign-in code has an iOS path, but this checkout has no real iOS Firebase app configuration. Choose and register an iOS bundle ID in the same Firebase project, download its `GoogleService-Info.plist`, then add the real `ios.bundleIdentifier` and `ios.googleServicesFile` to `app.json`. The installed Google Sign-In Expo plugin reads that plist and adds the reversed client ID URL scheme. Configure iOS signing/provisioning and make a new native development build. A physical iPhone requires a signed device build; a simulator requires a simulator build and an iOS/macOS environment. Do not point `app.json` to a nonexistent plist. iOS sign-in remains untested until these details and an iOS device or simulator are available.

## Checks and troubleshooting

Run `node --version`, `npx tsc --noEmit`, `npm run lint`, `node scripts/check-domain.cjs`, `npx expo-doctor@latest`, and `npx expo export --platform web` after installing dependencies. Verify `dist/index.html` exists. For local direct-route testing, serve `dist` with an SPA fallback (for example, `npx --yes serve -s dist`) and visit `/login` and `/dashboard` while signed out. A bundle/export check does not replace live Google sign-in tests. Check these flows on each available platform:

- Configured development Gmail signs in; another Gmail is rejected with the exact message.
- A signed-out direct visit to `/dashboard` opens Login; refresh and back navigation do not expose Dashboard.
- Restart restores an allowed native session; logout removes access and prevents repeated taps.
- Cancellation produces no error; network and OAuth configuration failures show a useful error.
- The isolated test script checks that strict mode would allow `example@hbplus.fit` and reject Gmail, `other.com`, and `fakehbplus.fit`, without modifying the actual development-mode setting.

If Android sign-in reports a developer/configuration error, check the package name, the SHA-1 of the actual signing key, the refreshed `google-services.json`, the Web OAuth client ID, and whether the app was rebuilt. For iOS, check the bundle ID, plist, reversed client ID scheme, and native rebuild. If Web sign-in fails, check Firebase authorized domains and browser pop-up settings.
