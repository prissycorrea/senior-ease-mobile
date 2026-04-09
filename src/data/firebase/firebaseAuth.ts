import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
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
    case "auth/requires-recent-login":
      return "Para sua segurança, faça o login novamente antes de alterar dados sensíveis ou excluir a conta.";
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

export async function firebaseUpdateProfile(displayName: string, emailStr: string): Promise<User> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("auth/user-not-found");

  const newName = displayName.trim() || "Usuário";
  const newEmail = emailStr.trim();

  let changed = false;
  if (newName !== user.displayName) {
    await updateProfile(user, { displayName: newName });
    changed = true;
  }
  
  if (newEmail !== "" && newEmail !== user.email) {
    await updateEmail(user, newEmail);
    changed = true;
  }

  if (changed) {
    await user.reload();
  }
  return auth.currentUser!;
}

export async function firebaseDeleteAccount(): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("auth/user-not-found");
  
  await deleteUser(user);
}
