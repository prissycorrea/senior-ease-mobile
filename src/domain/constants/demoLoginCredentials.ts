/** Conta fictícia para testar o login sem backend (protótipo). */
export const DEMO_LOGIN_EMAIL = "teste@seniorease.app";
export const DEMO_LOGIN_PASSWORD = "Senha123";

export function isDemoLoginValid(email: string, password: string): boolean {
  const e = email.trim().toLowerCase();
  const p = password.trim();
  return (
    e === DEMO_LOGIN_EMAIL.toLowerCase() && p === DEMO_LOGIN_PASSWORD
  );
}
