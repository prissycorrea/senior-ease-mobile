import { initializeApp, type FirebaseApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { environments } from "../../environments/environments";

let app: FirebaseApp | undefined;
let authSingleton: Auth | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(environments.firebase);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!authSingleton) {
    authSingleton = getAuth(getFirebaseApp());
  }
  return authSingleton;
}

export function getFirebaseFirestore() {
  return getFirestore(getFirebaseApp());
}
