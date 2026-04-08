import { FONT_SCALE_DEFAULT } from "./fontScale";
import type { ThemePreference } from "./ThemePreference";

/** 0 = fora do cadastro; 1–4 = etapas do fluxo “criar conta”. */
export type RegistrationStep = 0 | 1 | 2 | 3 | 4;

/** 0 = fora do login; 1 = e-mail; 2 = senha. */
export type LoginStep = 0 | 1 | 2;

export interface AppSettings {
  themePreference: ThemePreference;
  /** Tela inicial (boas-vindas) já vista */
  welcomeScreenCompleted: boolean;
  /** Passo 1 (conforto visual) concluído */
  visualOnboardingCompleted: boolean;
  /** Passo 2 (tamanho da letra) concluído */
  fontSizeOnboardingCompleted: boolean;
  fontScaleMultiplier: number;
  registrationStep: RegistrationStep;
  /** Nome na etapa 1 (persistido ao avançar). */
  registrationDraftFullName: string;
  /** E-mail na etapa 2 (persistido ao avançar). */
  registrationDraftEmail: string;
  loginStep: LoginStep;
  /** E-mail digitado no fluxo “já tenho conta”. */
  loginDraftEmail: string;
  /** Nome para exibir na home (cadastro ou login). */
  userDisplayName: string;
  /**
   * Último nome salvo ao concluir o cadastro (não é apagado ao voltar à welcome).
   * Usado no login de demonstração para exibir o nome que a pessoa cadastrou.
   */
  lastRegisteredDisplayName: string;
}

export const defaultAppSettings: AppSettings = {
  themePreference: "default",
  welcomeScreenCompleted: false,
  visualOnboardingCompleted: false,
  fontSizeOnboardingCompleted: false,
  fontScaleMultiplier: FONT_SCALE_DEFAULT,
  registrationStep: 0,
  registrationDraftFullName: "",
  registrationDraftEmail: "",
  loginStep: 0,
  loginDraftEmail: "",
  userDisplayName: "",
  lastRegisteredDisplayName: "",
};
