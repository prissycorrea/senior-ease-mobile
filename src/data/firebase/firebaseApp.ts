import { initializeApp, type FirebaseApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { environments } from "../../../assets/environments/environments";

let app: FirebaseApp | undefined;
let authSingleton: Auth | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(environments.firebase);
  }
  return app;
}

/**
 * Mesma base da web (AngularFire `getAuth`).
 * Nota: no Firebase JS SDK 11 o helper `getReactNativePersistence` não está disponível
 * neste bundle; usamos `getAuth`, que no Expo/Metro costuma manter a sessão no app.
 */
export function getFirebaseAuth(): Auth {
  if (!authSingleton) {
    authSingleton = getAuth(getFirebaseApp());
  }
  return authSingleton;
}

export function getFirebaseFirestore() {
  return getFirestore(getFirebaseApp());
}
