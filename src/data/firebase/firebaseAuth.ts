import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

import { getFirebaseAuth } from "./firebaseApp";

export function firebaseAuthErrorMessage(code: string | undefined): string {
  switch (code) {
    case "auth/invalid-email":
      return "O e-mail informado não é válido.";
    case "auth/user-disabled":
      return "Esta conta foi desativada.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-mail ou senha incorretos.";
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado.";
    case "auth/weak-password":
      return "Escolha uma senha um pouco mais forte.";
    case "auth/network-request-failed":
      return "Sem conexão. Verifique a internet e tente de novo.";
    default:
      return "Não foi possível concluir. Tente novamente em instantes.";
  }
}

export async function firebaseSignIn(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
}

export async function firebaseSignUp(
  displayName: string,
  email: string,
  password: string,
): Promise<User> {
  const auth = getFirebaseAuth();
  const cred = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  const user = cred.user;
  const name = displayName.trim() || "Usuário";
  await updateProfile(user, { displayName: name });
  await user.reload();
  return user;
}

export async function firebaseSignOut(): Promise<void> {
  await signOut(getFirebaseAuth());
}
