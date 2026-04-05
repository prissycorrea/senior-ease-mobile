/**
 * Conta fictícia para testar o login sem backend (protótipo).
 * Se a pessoa já concluiu um cadastro neste aparelho, a home usa o nome cadastrado;
 * caso contrário, usa DEMO_USER_DISPLAY_NAME abaixo.
 */
export const DEMO_LOGIN_EMAIL = "teste@seniorease.app";
export const DEMO_LOGIN_PASSWORD = "Senha123";

/** Nome exibido na home só quando não há cadastro anterior salvo no aparelho. */
export const DEMO_USER_DISPLAY_NAME = "Ricardo Almeida";

/** Vazio: dica de login foi removida da UI; mantém compatibilidade com bundle em cache. */
export const DEMO_LOGIN_HINT = "";

export function isDemoLoginValid(email: string, password: string): boolean {
  const e = email.trim().toLowerCase();
  const p = password.trim();
  return (
    e === DEMO_LOGIN_EMAIL.toLowerCase() && p === DEMO_LOGIN_PASSWORD
  );
}

/** Texto exibido quando o login demo falha (credenciais fictícias). */
export function demoLoginHelpMessage(): string {
  return (
    `Conta de teste (fictícia):\n` +
    `Nome na home (se nunca cadastrou): ${DEMO_USER_DISPLAY_NAME}\n` +
    `E-mail: ${DEMO_LOGIN_EMAIL}\n` +
    `Senha: ${DEMO_LOGIN_PASSWORD}`
  );
}
