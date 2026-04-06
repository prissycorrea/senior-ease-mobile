/**
 * Em testes (Jest), definimos `EXPO_PUBLIC_USE_FIREBASE=false` para manter o fluxo demo local.
 * No app real, omitir a variável ou usar `true` ativa Firebase (Auth + Firestore).
 */
export const useFirebaseAuth =
  process.env.EXPO_PUBLIC_USE_FIREBASE !== "false";
