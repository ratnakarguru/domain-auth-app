import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC8pIXu49b03sE56Dza_bj15tcn2T1RSgk",
  authDomain: "domain-auth-app-a8d19.firebaseapp.com",
  projectId: "domain-auth-app-a8d19",
  storageBucket: "domain-auth-app-a8d19.firebasestorage.app",
  messagingSenderId: "370081725844",
  appId: "1:370081725844:web:b0a8241f4c85f3eaaba381",
  measurementId: "G-NPE7Y9ZSYQ",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export default app;
