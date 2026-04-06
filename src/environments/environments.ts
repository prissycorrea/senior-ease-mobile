function req(label: string, value: string | undefined): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  throw new Error(
    `Variável de ambiente ausente: ${label}. Copie .env.example para .env e preencha os valores do Firebase.`,
  );
}

export const environments = {
  production: false,
  firebase: {
    apiKey: req(
      "EXPO_PUBLIC_FIREBASE_API_KEY",
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    ),
    authDomain: req(
      "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    ),
    projectId: req(
      "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    ),
    storageBucket: req(
      "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    ),
    messagingSenderId: req(
      "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    ),
    appId: req(
      "EXPO_PUBLIC_FIREBASE_APP_ID",
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    ),
    measurementId: req(
      "EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID",
      process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    ),
  },
};
