# Domain Auth

**Google Authentication & Domain-Restricted Access for Android and Web**

Built with **React Native (Expo)**, **Firebase Authentication**, and **Google OAuth 2.0**, Domain Auth is a responsive authentication application developed as a training assignment. It provides Google Sign-In, an email-domain access policy, a protected Dashboard, account information, and secure sign-out using a shared React Native codebase.

**[Live Web App](https://ratnakar-domain-auth-app.netlify.app)** · **[Android APK (EAS Build)](https://expo.dev/accounts/ratnakarguru/projects/domain-auth-app/builds/31989227-5d68-49c6-b921-8fb35ccd51dd)** · **[GitHub Release v1.0.0](https://github.com/ratnakarguru/domain-auth-app/releases/tag/v1.0.0)**

## Features

| Feature | Description |
| --- | --- |
| Google Sign-In | Google authentication on Web and native Android, integrated with Firebase Authentication |
| Domain-based access | Authorizes only verified accounts whose email domain exactly matches `hbplus.fit` |
| Protected Dashboard | Displays authenticated account information and prevents signed-out users from opening the Dashboard |
| Account details | Shows the Google profile name, email, optional profile photo, and verification status |
| Session management | Restores eligible sessions and clears unauthorized sessions |
| Logout | Signs out of Firebase and clears the native Google session where applicable |
| Responsive interface | Login, Dashboard, navbar, and footer layouts designed for browser and phone screens |
| Authentication feedback | Loading indicators and clear error messages for sign-in and sign-out |

## Application overview

The app has two primary screens:

- **Login:** a responsive entry screen with a Google Sign-In button, loading feedback, and access-denied messaging.
- **Dashboard:** a protected page with a navbar, welcome area, authentication status, Google account information, and Logout.

### Authentication flow

```text
Open application
       |
       v
Login with Google
       |
       v
Firebase Authentication
       |
       v
Check verified email + exact email domain
       |
       +-- Authorized --> Protected Dashboard --> Logout
       |
       +-- Rejected ---> Clear sign-in session --> Login + error
```

## Email-domain policy

The configured domain is **`hbplus.fit`**, matching the example supplied in the assignment. The policy is implemented in `src/utils/domainValidator.ts`.

| Email example | Access policy |
| --- | --- |
| `employee@hbplus.fit` | Eligible after successful Google/Firebase sign-in and email verification |
| `person@gmail.com` | Rejected |
| `person@hbplus.fit.evil.com` | Rejected |
| Missing, malformed, or unverified email | Rejected |

Email validation trims surrounding whitespace, compares domains without case sensitivity, and requires an **exact** domain match. Sign-ins with an unauthorized email domain display:

> Access restricted. Please login using your official domain email.

An account with an unverified email is also rejected; it displays a separate verification error.

The same authorization check is applied when restoring authentication state. Expo Router guards the Dashboard route so a signed-out user cannot access it by entering `/dashboard` directly.

## Technology stack

| Technology | Version in project | Purpose |
| --- | --- | --- |
| Expo | `~58.0.24` | Development and Android builds |
| React Native | `0.88.1` | Shared application UI |
| React Native Web | `~0.21.4` | Browser rendering |
| Expo Router | `~58.0.31` | Navigation and protected routes |
| TypeScript | `~6.0.3` | Application code |
| Firebase | `^13.2.0` | Authentication and session state |
| Google Sign-In | `@react-native-google-signin/google-signin` `^17.0.0` | Native Android Google Sign-In |
| Netlify | — | Web deployment |
| EAS Build | — | Android development and standalone APK builds |

## Project structure

```text
src/
  app/
    login.tsx                     Login screen
    dashboard.tsx                 Protected Dashboard
    _layout.tsx                   Route protection
  config/
    firebaseApp.ts               Firebase application configuration
    firebase.ts                  Web Firebase Auth
    firebase.native.ts           Native Firebase Auth persistence
  context/
    AuthContext.tsx              Session and authorization state
  services/
    authService.ts               Login, rejection cleanup, and Logout
    googleSignIn.ts              Web Google Sign-In
    googleSignIn.native.ts       Native Google Sign-In
  utils/
    domainValidator.ts           Exact domain validation
scripts/
  check-domain.cjs               Domain-policy checks
app.json                         Expo app and Android identifiers
eas.json                         EAS development/preview profiles
netlify.toml                     Web export and SPA routing
README.md                        Project documentation
```

## Getting started

### Prerequisites

- Node.js, npm, Git, and an internet connection.
- Access to a configured Firebase project with Google Sign-In enabled.
- For Android builds: an Expo account and an Android phone with Google Play services (or a suitable emulator).

### 1. Clone and install

```bash
git clone https://github.com/ratnakarguru/domain-auth-app.git
cd domain-auth-app
npm install
```

### 2. Run on Web

```bash
npx expo start --web
```

For Google login in a browser, configure the relevant hostname in **Firebase Console → Authentication → Settings → Authorized domains**. The deployed Netlify hostname must be authorized as well.

### 3. Run on Android (development build)

This project uses a native Google Sign-In module, so Android testing uses a **custom Expo development build**, rather than Expo Go.

```bash
npx eas-cli@latest login
npx eas-cli@latest project:info
npx eas-cli@latest build -p android --profile development
```

Install the resulting development APK on your phone. Then start the development server:

```bash
npx expo start --dev-client --tunnel --clear
```

Scan the development-server QR code with the phone and open it in the installed Domain Auth development app. Tunnel mode is useful when your phone cannot connect to the computer's LAN address. If local networking works, `npx expo start --dev-client --clear` is also supported.

### 4. Build a standalone Android APK

```bash
npx eas-cli@latest build -p android --profile preview
```

The preview profile builds an installable APK that runs without the Expo development server. The **[Expo build page](https://expo.dev/accounts/ratnakarguru/projects/domain-auth-app/builds/31989227-5d68-49c6-b921-8fb35ccd51dd)** reports a succeeded APK. The APK is also attached to the **[v1.0.0 GitHub Release](https://github.com/ratnakarguru/domain-auth-app/releases/tag/v1.0.0)**. The owner reports installing it, launching it without Metro, and confirming Gmail rejection.

## Firebase and Android configuration

The existing application uses the Firebase project associated with the repository. If configuring a different Firebase project, update the actual Firebase and OAuth configuration rather than using placeholder credentials.

For Android Google Sign-In, check that:

1. The Firebase Android application package is `com.domainauthapp.mobile`.
2. The signing certificate's **SHA-1** is registered with that Firebase Android app (and SHA-256 when appropriate).
3. The downloaded `google-services.json` matches the Firebase project and Android app.
4. The native Google Sign-In configuration uses the appropriate OAuth client ID.
5. The APK is rebuilt when native configuration or signing credentials change.

The checked-in `google-services.json` currently lists a Web OAuth client but no Android OAuth client entry. The owner reports that the existing development build worked. For a fresh signed build or an OAuth code 10 error, verify the real signing SHA-1 and download a refreshed JSON from Firebase; keep the existing EAS keystore.

For Web, keep the Firebase Authentication authorized-domain list in sync with the actual site hostname. Hosting a Web app on Netlify does not require changing Firebase `authDomain` to the Netlify domain.

## Web deployment

The live Web application is hosted at:

**https://ratnakar-domain-auth-app.netlify.app**

`netlify.toml` exports the Web bundle with `npx expo export --platform web`, publishes the `dist` directory, and configures a single-page-app rewrite so that routes such as `/dashboard` work on refresh.

The GitHub repository is connected to Netlify for deployment from the `main` branch.

## Testing and verification

| Check | Result |
| --- | --- |
| TypeScript and lint | Passed locally |
| Strict-domain tests | Passed: 3 allowed and 12 rejected examples; mocked rejection/cleanup checks passed |
| Expo Doctor | Passed: 20/20 |
| Web and Android JavaScript exports | Passed |
| Android development build | Google Sign-In, Dashboard, Logout, and session behavior tested with the temporary development account before final enforcement |
| Standalone Android preview APK | Build page confirms a succeeded APK; owner reports installation, standalone launch, and unauthorized Gmail rejection with the final strict-domain version |
| Web UI | Login, routing, and responsive behavior checked locally; live Web login was previously tested before strict enforcement |

**Authorized-account verification:** The app's final configured domain is `@hbplus.fit`. Its exact-match policy is covered by automated tests, but successful live Google sign-in with a matching-domain account has not been demonstrated. A valid matching Google account is needed to complete that end-to-end check.

## Troubleshooting

| Problem | Suggested check |
| --- | --- |
| Android Google Sign-In returns `DEVELOPER_ERROR` or code `10` | Verify the package name, EAS signing SHA-1, Firebase Android OAuth client, Web client ID, and refreshed `google-services.json` |
| Phone cannot connect to Metro (`ETIMEDOUT`, port `8081`) | Use `npx expo start --dev-client --tunnel --clear`, or check LAN and firewall connectivity |
| Google popup fails on Web | Check Firebase authorized domains and browser popup permissions |
| `/dashboard` redirects to Login | Expected when there is no authorized Firebase session |

## Security notes

- The app checks Firebase authentication state, email verification, and exact domain eligibility before showing the protected Dashboard.
- Rejected accounts are signed out, and access checks are applied when sessions are restored.
- Keep service-account credentials, keystore files, signing passwords, and private tokens out of source control.
- Dashboard route guards protect the application interface. Any future protected API or database must independently verify Firebase ID tokens and enforce authorization on the server.

---

**Project:** Domain Auth · **Platforms:** Android and Web · **Repository:** [ratnakarguru/domain-auth-app](https://github.com/ratnakarguru/domain-auth-app)
